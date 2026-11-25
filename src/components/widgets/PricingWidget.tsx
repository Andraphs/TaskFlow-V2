import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { PricingTierItem } from '../../data/mockData';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface PricingWidgetProps {
  eyebrow: string;
  headline: string;
  description: string;
  tiers: PricingTierItem[];
  guarantees: { icon: string; iconColorClass: string; label: string }[];
  /** Controlled billing mode ('monthly' | 'yearly') for Remotion renders */
  billingCycle?: 'monthly' | 'yearly';
  onBillingChange?: (cycle: 'monthly' | 'yearly') => void;
  onSelectPlan?: (planName: string, cycle: 'monthly' | 'yearly') => void;
  immediate?: boolean;
}

export function PricingWidget({
  eyebrow,
  headline,
  description,
  tiers,
  guarantees,
  billingCycle: controlledCycle,
  onBillingChange,
  onSelectPlan,
  immediate = false,
}: PricingWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalCycle, setInternalCycle] = useState<'monthly' | 'yearly'>('monthly');
  const activeCycle = controlledCycle ?? internalCycle;
  const cycleIndex = activeCycle === 'yearly' ? 1 : 0;

  const handleCycleChange = (next: 'monthly' | 'yearly') => {
    if (controlledCycle === undefined) {
      setInternalCycle(next);
    }
    onBillingChange?.(next);
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-20 max-w-[1120px] mx-auto px-page-margin py-16 flex flex-col items-center gap-gutter-xl"
    >
      <RevealSection immediate={immediate} className="w-full flex flex-col items-center">
        <div className="text-center max-w-[580px] flex flex-col items-center gap-gutter-sm">
          <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-secondary-soft text-light-secondary">
            {eyebrow}
          </span>
          <h2 className="font-headline text-headline-lg text-light-primary text-balance">
            {headline}
          </h2>
          <p className="font-body text-body-md text-light-on-surface-variant">{description}</p>

          {/* Sliding Pill Billing Toggle */}
          <div
            className="relative grid grid-cols-2 bg-neutral-canvas p-1 rounded-full w-[268px] mt-gutter-sm border border-light-outline-variant/40"
            role="group"
            aria-label="Billing cycle"
          >
            <motion.span
              aria-hidden="true"
              animate={{ x: `${cycleIndex * 100}%` }}
              transition={shouldReduceMotion ? { duration: 0 } : stitchMotion.springSnappy}
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-full bg-light-primary shadow-sm pointer-events-none"
            />
            <button
              type="button"
              onClick={() => handleCycleChange('monthly')}
              aria-pressed={activeCycle === 'monthly'}
              className={`relative z-10 h-9 rounded-full font-body text-label-lg transition-colors duration-200 motion-reduce:transition-none ${
                activeCycle === 'monthly'
                  ? 'text-light-on-primary'
                  : 'text-light-on-surface-variant hover:text-light-primary'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => handleCycleChange('yearly')}
              aria-pressed={activeCycle === 'yearly'}
              className={`relative z-10 h-9 rounded-full font-body text-label-lg transition-colors duration-200 motion-reduce:transition-none tabular-nums ${
                activeCycle === 'yearly'
                  ? 'text-light-on-primary'
                  : 'text-light-on-surface-variant hover:text-light-primary'
              }`}
            >
              Yearly -20%
            </button>
          </div>
        </div>
      </RevealSection>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-gutter-lg items-stretch pt-gutter-md">
        {tiers.map((tier, idx) => {
          const isDark = tier.tierTone === 'dark';
          const isEnterprise = tier.tierTone === 'enterprise';
          const displayPrice =
            activeCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;

          const cardContent = (
            <>
              <div className="flex flex-col gap-gutter-md">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark
                        ? 'bg-light-secondary text-light-on-secondary'
                        : isEnterprise
                          ? 'bg-secondary-soft text-light-secondary'
                          : 'bg-neutral-canvas text-light-primary'
                    }`}
                  >
                    <MaterialIcon name={tier.icon} size={20} />
                  </span>
                  <span
                    className={`font-body text-label-sm px-gutter-md py-0.5 rounded-full ${
                      isDark
                        ? 'bg-light-secondary text-light-on-secondary'
                        : isEnterprise
                          ? 'bg-secondary-soft text-light-secondary'
                          : 'bg-neutral-canvas text-light-on-surface-variant'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <h3
                    className={`font-headline text-headline-md ${
                      isDark ? 'text-light-on-primary' : 'text-light-on-surface'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`font-body text-body-sm mt-1 ${
                      isDark ? 'text-light-on-primary/75' : 'text-light-on-surface-variant'
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline gap-1.5 pt-gutter-xs" aria-live="polite">
                  <span
                    className={`font-headline text-display-lg tabular-nums ${
                      isDark ? 'text-light-on-primary' : 'text-light-primary'
                    }`}
                  >
                    {displayPrice}
                  </span>
                  <span
                    className={`font-body text-body-sm whitespace-nowrap ${
                      isDark ? 'text-light-on-primary/75' : 'text-light-on-surface-variant'
                    }`}
                  >
                    {tier.unitLabel}
                  </span>
                </div>

                <div
                  className={`rounded-lg p-gutter-md border flex flex-col gap-gutter-sm ${
                    isDark
                      ? 'bg-light-primary-container border-light-outline-variant/20'
                      : 'bg-light-surface border-light-outline-variant/30'
                  }`}
                >
                  {tier.features.map((feature) => (
                    <div
                      key={feature}
                      className={`flex items-center gap-gutter-sm font-body text-body-sm ${
                        isDark ? 'text-light-on-primary' : 'text-light-on-surface'
                      }`}
                    >
                      <MaterialIcon
                        name="check_circle"
                        size={17}
                        className={isDark ? 'text-dark-mint shrink-0' : 'text-light-mint shrink-0'}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onSelectPlan ? (
                <button
                  type="button"
                  onClick={() => onSelectPlan(tier.name, activeCycle)}
                  className={`w-full py-gutter-md rounded-full text-center font-body text-label-lg active:scale-95 ${
                    isDark
                      ? 'transition-[transform,opacity] duration-150 bg-light-secondary text-light-on-secondary shadow-[0_10px_24px_-6px_rgba(82,32,229,0.55)] hover:opacity-95'
                      : isEnterprise
                        ? 'transition-all bg-light-primary text-light-on-primary hover:opacity-90'
                        : 'transition-all bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant'
                  }`}
                >
                  {tier.ctaLabel}
                </button>
              ) : (
                <a
                  href="#cta"
                  className={`w-full py-gutter-md rounded-full text-center font-body text-label-lg active:scale-95 ${
                    isDark
                      ? 'transition-[transform,opacity] duration-150 bg-light-secondary text-light-on-secondary shadow-[0_10px_24px_-6px_rgba(82,32,229,0.55)] hover:opacity-95'
                      : isEnterprise
                        ? 'transition-all bg-light-primary text-light-on-primary hover:opacity-90'
                        : 'transition-all bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant'
                  }`}
                >
                  {tier.ctaLabel}
                </a>
              )}
            </>
          );

          return (
            <RevealSection
              key={tier.id}
              immediate={immediate}
              delay={idx * 0.04}
              className={isDark ? 'flex relative z-10' : 'flex'}
            >
              {isDark ? (
                <div className="pricing-featured-wrap w-full flex md:-translate-y-3">
                  <article className="pricing-featured-card relative isolate w-full rounded-xl p-gutter-xl flex flex-col justify-between gap-gutter-lg bg-light-primary text-light-on-primary border border-light-secondary/60 shadow-[0_28px_64px_-16px_rgba(82,32,229,0.35)]">
                    {cardContent}
                  </article>
                </div>
              ) : (
                <article className="w-full bento-3d rounded-xl p-gutter-xl flex flex-col justify-between gap-gutter-lg bg-light-surface-container-lowest border border-light-outline-variant/50">
                  {cardContent}
                </article>
              )}
            </RevealSection>
          );
        })}
      </div>

      {/* Compact Guarantee Strip */}
      <div className="flex flex-wrap items-center justify-center gap-x-gutter-xl gap-y-gutter-sm pt-gutter-xs text-light-on-surface-variant">
        {guarantees.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <MaterialIcon name={item.icon} size={16} className={item.iconColorClass} />
            <span className="font-body text-body-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
