import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { VelocityTimeframeData } from '../../data/mockData';
import { stitchMotion } from '../../tokens/designTokens';

export interface VelocityChartWidgetProps {
  timeframes: VelocityTimeframeData[];
  defaultIndex?: number;
  /** Controlled index override for Remotion compositions */
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

const textMorphVariants = {
  enter: (direction: number) => ({
    y: direction >= 0 ? 12 : -12,
    opacity: 0,
    filter: 'blur(4px)',
    scale: 0.96,
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction >= 0 ? -12 : 12,
    opacity: 0,
    filter: 'blur(4px)',
    scale: 0.96,
  }),
};

export function VelocityChartWidget({
  timeframes,
  defaultIndex = 1,
  activeIndex: controlledIndex,
  onIndexChange,
  eyebrow = 'Live Velocity',
  title = 'Spot bottlenecks before Friday',
  description = 'Compare completed tasks against daily sprint targets with hatched target overlays.',
  className = '',
}: VelocityChartWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [direction, setDirection] = useState(1);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const currentIndex = controlledIndex ?? internalIndex;
  const activeData = timeframes[currentIndex] ?? timeframes[0];

  const defaultHighlightedIndex = Math.max(
    0,
    activeData.bars.findIndex((bar) => bar.highlighted)
  );
  const activeBarIndex =
    hoveredBarIndex !== null
      ? hoveredBarIndex
      : selectedBarIndex !== null && selectedBarIndex < activeData.bars.length
        ? selectedBarIndex
        : defaultHighlightedIndex;

  const handleSelect = (idx: number) => {
    if (idx !== currentIndex) {
      setDirection(idx > currentIndex ? 1 : -1);
      setSelectedBarIndex(null);
      setHoveredBarIndex(null);
    }
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    onIndexChange?.(idx);
  };

  return (
    <article
      className={`bento-3d bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-xl flex flex-col justify-between gap-gutter-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <div className="flex flex-wrap items-center gap-gutter-sm">
            <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-secondary-soft text-light-secondary">
              {eyebrow}
            </span>

            {/* Animated Peak Label Morph (preserving original plain text styling) */}
            <span className="relative inline-flex items-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={`${activeData.id}-${activeData.peakLabel}`}
                  custom={direction}
                  variants={textMorphVariants}
                  initial={shouldReduceMotion ? false : 'enter'}
                  animate="center"
                  exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: 360,
                          damping: 28,
                          mass: 0.85,
                        }
                  }
                  aria-live="polite"
                  className="font-mono text-mono-sm text-light-mint tabular-nums whitespace-nowrap"
                >
                  {activeData.peakLabel}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <h3 className="font-headline text-headline-md text-light-on-surface">{title}</h3>
          <p className="font-body text-body-sm text-light-on-surface-variant max-w-[400px]">
            {description}
          </p>
        </div>

        {/* Interactive Timeframe Sliding Pill */}
        <div
          className="relative grid grid-cols-3 bg-neutral-canvas p-1 rounded-full w-full sm:w-[210px] shrink-0"
          role="group"
          aria-label="Velocity timeframe"
        >
          <motion.span
            aria-hidden="true"
            animate={{ x: `${currentIndex * 100}%` }}
            transition={shouldReduceMotion ? { duration: 0 } : stitchMotion.springSnappy}
            className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-light-primary shadow-sm pointer-events-none"
          />
          {timeframes.map((tf, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => handleSelect(idx)}
                aria-pressed={isSelected}
                className="relative z-10 h-8 sm:h-7 rounded-full font-body text-label-sm overflow-hidden flex items-center justify-center"
              >
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? { scale: 1, y: 0 }
                      : {
                          scale: isSelected ? 1.03 : 0.98,
                          y: isSelected ? -0.5 : 0,
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 28 }
                  }
                  className={`transition-colors duration-200 motion-reduce:transition-none ${
                    isSelected
                      ? 'text-light-on-primary'
                      : 'text-light-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  {tf.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hatched Target Overlay Bar Chart (extra top clearance keeps tallest bar tooltip inside frame) */}
      <div
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') setHoveredBarIndex(null);
        }}
        className="bg-light-surface rounded-lg pt-9 pb-gutter-md px-gutter-md sm:pt-10 sm:pb-gutter-lg sm:px-gutter-lg grid grid-cols-7 gap-gutter-xs sm:gap-gutter-sm items-end h-48 border border-light-outline-variant/30"
      >
        {activeData.bars.map((bar, idx) => {
          const isHovered = hoveredBarIndex === idx;
          const isSelected = hoveredBarIndex === null && selectedBarIndex === idx;
          const isActiveVisual = idx === activeBarIndex;
          const isDimmed = hoveredBarIndex !== null && !isHovered;
          const showTooltip = isHovered || isSelected;

          return (
            <div
              key={bar.day}
              role="button"
              tabIndex={0}
              aria-pressed={isActiveVisual}
              aria-label={`${bar.day}: ${bar.fillHeightPct}% velocity`}
              onClick={() => setSelectedBarIndex((prev) => (prev === idx ? null : idx))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedBarIndex((prev) => (prev === idx ? null : idx));
                }
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') setHoveredBarIndex(idx);
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) {
                  setHoveredBarIndex(idx);
                }
              }}
              onBlur={() => setHoveredBarIndex((prev) => (prev === idx ? null : prev))}
              className="relative flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-light-secondary/50 rounded-md"
            >
              {/* Bar Wrapper (positions floating tooltip directly above & centered on this bar) */}
              <motion.div
                initial={false}
                animate={{
                  height: `${bar.targetHeightPct}%`,
                  y: isHovered && !shouldReduceMotion ? -4 : 0,
                  opacity: isDimmed ? 0.62 : 1,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 280,
                        damping: 24,
                        mass: 0.8,
                      }
                }
                className="relative w-full max-w-10 flex items-end"
              >
                {/* Floating Percentage Tooltip centered cleanly via flex (no transform collision) */}
                <div className="pointer-events-none absolute -top-7 inset-x-0 z-20 flex justify-center">
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={
                          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.9 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.92 }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 440, damping: 28 }
                        }
                        className="px-2 py-0.5 rounded-full bg-light-primary text-light-on-primary font-mono text-[11px] leading-tight tabular-nums shadow-[0_8px_18px_-6px_rgba(8,12,22,0.45)] whitespace-nowrap"
                      >
                        {bar.fillHeightPct}%
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hatched Target Bar Column */}
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isHovered && !shouldReduceMotion ? 1.06 : 1,
                    boxShadow: isHovered
                      ? '0 12px 24px -8px rgba(82, 32, 229, 0.36)'
                      : '0 0 0 0 rgba(82, 32, 229, 0)',
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: 280,
                          damping: 24,
                          mass: 0.8,
                        }
                  }
                  className={`w-full h-full rounded-md overflow-hidden flex flex-col justify-end transition-shadow duration-300 motion-reduce:transition-none ${
                    isHovered
                      ? 'ring-2 ring-light-secondary/45'
                      : isActiveVisual
                        ? 'ring-2 ring-light-secondary/30'
                        : 'ring-0'
                  }`}
                  style={{
                    background: isActiveVisual
                      ? 'repeating-linear-gradient(-45deg, #C9BEFF, #C9BEFF 2px, #F4EEFF 2px, #F4EEFF 6px)'
                      : 'repeating-linear-gradient(-45deg, #D8D4EB, #D8D4EB 2px, #F8F9FF 2px, #F8F9FF 6px)',
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      height: `${bar.fillHeightPct}%`,
                      backgroundColor: isActiveVisual ? '#5220E5' : '#E6DEFF',
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            height: {
                              type: 'spring',
                              stiffness: 210,
                              damping: 24,
                              delay: idx * 0.02,
                            },
                            backgroundColor: {
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }
                    }
                    className="w-full rounded-md"
                  />
                </motion.div>
              </motion.div>

              {/* Day Label */}
              <motion.span
                animate={{
                  scale: isHovered && !shouldReduceMotion ? 1.06 : 1,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 380, damping: 26 }
                }
                className={`font-body text-label-sm transition-colors duration-200 motion-reduce:transition-none ${
                  isHovered
                    ? 'px-1.5 rounded-full bg-light-secondary text-light-on-secondary'
                    : isActiveVisual
                      ? 'px-1.5 rounded-full bg-light-primary text-light-on-primary'
                      : 'text-light-on-surface-variant'
                }`}
              >
                {bar.day}
              </motion.span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
