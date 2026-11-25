import { useState } from 'react';
import { motion } from 'framer-motion';
import type { WorkflowData } from '../../data/mockData';
import { stitchMotion } from '../../tokens/designTokens';
import { Avatar } from './Avatar';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface WorkflowCarouselWidgetProps {
  data: WorkflowData;
  /** Controlled active tab index (0, 1, 2) for Remotion renders */
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  immediate?: boolean;
}

export function WorkflowCarouselWidget({
  data,
  activeIndex: controlledIndex,
  onIndexChange,
  immediate = false,
}: WorkflowCarouselWidgetProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = controlledIndex ?? internalIndex;

  const handleSelect = (idx: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    onIndexChange?.(idx);
  };

  const { planSlide, focusSlide, shipSlide } = data;

  return (
    <section
      id="workflow"
      className="max-w-[1120px] mx-auto px-page-margin py-16 flex flex-col gap-gutter-xl"
    >
      <RevealSection immediate={immediate}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-lg">
          <div className="max-w-[540px] flex flex-col gap-gutter-sm">
            <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-secondary-soft text-light-secondary w-fit">
              {data.eyebrow}
            </span>
            <h2 className="font-headline text-headline-lg text-light-primary text-balance">
              {data.headline}
            </h2>
          </div>

          {/* Sliding Pill Workflow Switcher */}
          <div
            className="relative grid grid-cols-3 bg-neutral-canvas p-1 rounded-full w-full md:w-[440px] shrink-0 border border-light-outline-variant/40"
            role="tablist"
            aria-label="Workflow steps"
          >
            <motion.span
              aria-hidden="true"
              animate={{ x: `${currentIndex * 100}%` }}
              transition={stitchMotion.springSnappy}
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-light-primary shadow-sm pointer-events-none"
            />
            {data.tabs.map((tab, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(idx)}
                  className={`relative z-10 h-9 rounded-full font-body text-label-sm transition-colors duration-200 px-1.5 sm:px-2 truncate ${
                    isSelected
                      ? 'text-light-on-primary'
                      : 'text-light-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </RevealSection>

      {/* Horizontal 3-Slide Carousel */}
      <RevealSection immediate={immediate} delay={0.04}>
        <div className="overflow-hidden rounded-xl border border-light-outline-variant/50 bg-light-surface-container-lowest shadow-[0_24px_60px_-20px_rgba(8,12,22,0.12)]">
          <motion.div
            animate={{ x: `-${(currentIndex * 100) / 3}%` }}
            transition={{ duration: 0.42, ease: stitchMotion.easeHeavyDecel }}
            className="flex w-[300%]"
          >
            {/* Slide 1: Plan Sprint */}
            <div className="w-1/3 p-gutter-xl md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
              <div className="lg:col-span-5 flex flex-col gap-gutter-md">
                <div className="flex items-center gap-gutter-sm">
                  <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-md bg-light-primary text-light-on-primary tabular-nums">
                    {planSlide.stepNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-gutter-md py-1 rounded-full bg-secondary-soft text-light-secondary font-body text-label-sm">
                    <MaterialIcon name={planSlide.badgeIcon} size={14} />
                    {planSlide.badgeLabel}
                  </span>
                </div>
                <h3 className="font-headline text-headline-md text-light-on-surface">
                  {planSlide.title}
                </h3>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  {planSlide.description}
                </p>
                <div className="flex flex-wrap gap-gutter-sm pt-gutter-xs">
                  {planSlide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-neutral-canvas text-light-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-neutral-canvas rounded-xl p-gutter-lg border border-light-outline-variant/40 flex flex-col gap-gutter-md">
                <div className="flex flex-wrap items-center justify-between gap-gutter-xs">
                  <span className="font-headline text-title-md text-light-on-surface">
                    {planSlide.plannerTitle}
                  </span>
                  <span className="font-body text-label-sm px-gutter-md py-0.5 rounded-full bg-mint-soft text-light-mint tabular-nums">
                    {planSlide.plannerStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1 h-2 w-full rounded-full overflow-hidden bg-light-surface-container-lowest">
                  {planSlide.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className={`h-full ${seg.colorClass}`}
                      style={{ width: `${seg.widthPct}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
                  {planSlide.cards.map((card) => (
                    <div
                      key={card.taskTitle}
                      className="bg-light-surface-container-lowest rounded-lg p-gutter-md border border-light-outline-variant/30 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-body text-label-sm ${card.departmentColorClass}`}>
                          {card.department}
                        </span>
                        <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                          {card.pointsLabel}
                        </span>
                      </div>
                      <p className="font-body text-body-sm text-light-on-surface">
                        {card.taskTitle}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Avatar
                          src={card.assigneeAvatar}
                          alt={card.assigneeName}
                          className="w-5 h-5"
                        />
                        <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                          {card.loadLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide 2: Track & Focus */}
            <div className="w-1/3 p-gutter-xl md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
              <div className="lg:col-span-5 flex flex-col gap-gutter-md">
                <div className="flex items-center gap-gutter-sm">
                  <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-md bg-light-primary text-light-on-primary tabular-nums">
                    {focusSlide.stepNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-gutter-md py-1 rounded-full bg-mint-soft text-light-mint font-body text-label-sm">
                    <MaterialIcon name={focusSlide.badgeIcon} size={14} />
                    {focusSlide.badgeLabel}
                  </span>
                </div>
                <h3 className="font-headline text-headline-md text-light-on-surface">
                  {focusSlide.title}
                </h3>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  {focusSlide.description}
                </p>
                <div className="flex flex-wrap gap-gutter-sm pt-gutter-xs">
                  {focusSlide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-neutral-canvas text-light-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-light-primary text-light-on-primary rounded-xl p-gutter-lg flex flex-col gap-gutter-md">
                <div className="flex flex-wrap items-center justify-between gap-gutter-xs">
                  <span className="font-headline text-title-md text-light-on-primary">
                    {focusSlide.panelTitle}
                  </span>
                  <span className="font-body text-label-sm px-gutter-md py-0.5 rounded-full bg-light-primary-container text-dark-mint">
                    {focusSlide.panelStatus}
                  </span>
                </div>
                <div className="bg-light-primary-container rounded-lg p-gutter-md border border-light-on-primary/10 flex flex-wrap items-center justify-between gap-gutter-md">
                  <div className="flex items-center gap-gutter-md">
                    <span className="w-10 h-10 rounded-full bg-light-secondary text-light-on-secondary flex items-center justify-center shrink-0">
                      <MaterialIcon name="bolt" size={18} />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-body text-body-md text-light-on-primary">
                        {focusSlide.activeTaskTitle}
                      </span>
                      <span className="font-mono text-mono-sm text-light-on-primary/70 tabular-nums">
                        {focusSlide.activeTaskMeta}
                      </span>
                    </div>
                  </div>
                  <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-dark-mint text-light-primary">
                    {focusSlide.flowBadge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-gutter-xs text-light-on-primary/75">
                  <span className="font-body text-body-sm tabular-nums">
                    {focusSlide.footerLeft}
                  </span>
                  <span className="font-mono text-mono-sm text-dark-mint">
                    {focusSlide.footerRight}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide 3: Ship & Retro */}
            <div className="w-1/3 p-gutter-xl md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
              <div className="lg:col-span-5 flex flex-col gap-gutter-md">
                <div className="flex items-center gap-gutter-sm">
                  <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-md bg-light-primary text-light-on-primary tabular-nums">
                    {shipSlide.stepNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-gutter-md py-1 rounded-full bg-tertiary-soft text-light-tertiary font-body text-label-sm">
                    <MaterialIcon name={shipSlide.badgeIcon} size={14} />
                    {shipSlide.badgeLabel}
                  </span>
                </div>
                <h3 className="font-headline text-headline-md text-light-on-surface">
                  {shipSlide.title}
                </h3>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  {shipSlide.description}
                </p>
                <div className="flex flex-wrap gap-gutter-sm pt-gutter-xs">
                  {shipSlide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-neutral-canvas text-light-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-neutral-canvas rounded-xl p-gutter-lg border border-light-outline-variant/40 flex flex-col gap-gutter-md">
                <div className="flex flex-wrap items-center justify-between gap-gutter-xs">
                  <span className="font-headline text-title-md text-light-on-surface">
                    {shipSlide.summaryTitle}
                  </span>
                  <span className="font-body text-label-sm px-gutter-md py-0.5 rounded-full bg-mint-soft text-light-mint tabular-nums">
                    {shipSlide.summaryBadge}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-gutter-sm">
                  {shipSlide.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-light-surface-container-lowest rounded-lg p-gutter-md text-center"
                    >
                      <p
                        className={`font-headline text-headline-md tabular-nums ${stat.valueColorClass}`}
                      >
                        {stat.value}
                      </p>
                      <p className="font-body text-body-sm text-light-on-surface-variant">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-light-surface-container-lowest rounded-lg px-gutter-md py-gutter-sm flex flex-wrap items-center justify-between gap-gutter-xs">
                  <span className="font-body text-body-sm text-light-on-surface">
                    {shipSlide.releaseNoteText}
                  </span>
                  <span className="font-mono text-mono-sm text-light-secondary">
                    {shipSlide.releaseChannel}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>
    </section>
  );
}
