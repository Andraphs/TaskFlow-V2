import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const currentIndex = controlledIndex ?? internalIndex;
  const activeData = timeframes[currentIndex] ?? timeframes[0];

  const handleSelect = (idx: number) => {
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
            <span className="font-mono text-mono-sm text-light-mint tabular-nums">
              {activeData.peakLabel}
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
            transition={stitchMotion.springSnappy}
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
                className={`relative z-10 h-8 sm:h-7 rounded-full font-body text-label-sm transition-colors ${
                  isSelected ? 'text-light-on-primary' : 'text-light-on-surface-variant hover:text-light-primary'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hatched Target Overlay Bar Chart */}
      <div className="bg-light-surface rounded-lg p-gutter-md sm:p-gutter-lg grid grid-cols-7 gap-gutter-xs sm:gap-gutter-sm items-end h-44 border border-light-outline-variant/30">
        {activeData.bars.map((bar) => (
          <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              className={`w-full max-w-10 rounded-md overflow-hidden flex flex-col justify-end ${
                bar.highlighted ? 'ring-2 ring-light-secondary/30' : ''
              }`}
              style={{
                height: `${bar.targetHeightPct}%`,
                background: bar.highlighted
                  ? 'repeating-linear-gradient(-45deg, #C9BEFF, #C9BEFF 2px, #F4EEFF 2px, #F4EEFF 6px)'
                  : 'repeating-linear-gradient(-45deg, #D8D4EB, #D8D4EB 2px, #F8F9FF 2px, #F8F9FF 6px)',
              }}
            >
              <motion.div
                initial={false}
                animate={{ height: `${bar.fillHeightPct}%` }}
                transition={{ duration: 0.36, ease: stitchMotion.easeHeavyDecel }}
                className={`w-full rounded-md transition-colors duration-200 ${
                  bar.highlighted
                    ? 'bg-light-secondary'
                    : 'bg-light-secondary-container hover:bg-light-secondary'
                }`}
                title={`${bar.day}: ${bar.fillHeightPct}%`}
              />
            </div>
            <span
              className={`font-body text-label-sm ${
                bar.highlighted
                  ? 'px-1.5 rounded-full bg-light-primary text-light-on-primary'
                  : 'text-light-on-surface-variant'
              }`}
            >
              {bar.day}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
