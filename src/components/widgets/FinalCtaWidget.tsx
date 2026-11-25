import type { AvatarProfile } from '../../data/mockData';
import { Avatar } from './Avatar';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface FinalCtaWidgetProps {
  statusLabel: string;
  headline: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  card: {
    title: string;
    badge: string;
    checklist: string[];
    avatars: AvatarProfile[];
    footerMetric: string;
  };
  onCreateWorkspace?: () => void;
  immediate?: boolean;
}

export function FinalCtaWidget({
  statusLabel,
  headline,
  description,
  primaryCta,
  secondaryCta,
  card,
  onCreateWorkspace,
  immediate = false,
}: FinalCtaWidgetProps) {
  return (
    <section id="cta" className="scroll-mt-20 max-w-[1120px] mx-auto px-page-margin pb-16">
      <RevealSection immediate={immediate}>
        <div className="bg-light-primary text-light-on-primary rounded-xl p-gutter-xl md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center shadow-[0_28px_64px_-18px_rgba(8,12,22,0.28)]">
          <div className="lg:col-span-7 flex flex-col gap-gutter-md">
            <div className="inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-full bg-light-primary-container border border-dark-mint/30 w-fit">
              <span className="relative inline-block w-2 h-2 rounded-full bg-dark-mint ping-dot" />
              <span className="font-body text-label-sm text-dark-mint">{statusLabel}</span>
            </div>
            <h2 className="font-headline text-headline-lg text-light-on-primary text-balance">
              {headline}
            </h2>
            <p className="font-body text-body-md text-light-on-primary/80 max-w-[500px]">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-gutter-md pt-gutter-xs">
              {onCreateWorkspace ? (
                <button
                  type="button"
                  onClick={onCreateWorkspace}
                  className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-secondary text-light-on-secondary shadow-[0_12px_28px_-8px_rgba(82,32,229,0.5)] hover:opacity-95 active:scale-95 transition-all duration-150"
                >
                  <span className="font-body text-label-lg">{primaryCta}</span>
                  <MaterialIcon name="arrow_forward" size={18} />
                </button>
              ) : (
                <a
                  href="#top"
                  className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-secondary text-light-on-secondary shadow-[0_12px_28px_-8px_rgba(82,32,229,0.5)] hover:opacity-95 active:scale-95 transition-all duration-150"
                >
                  <span className="font-body text-label-lg">{primaryCta}</span>
                  <MaterialIcon name="arrow_forward" size={18} />
                </a>
              )}
              <a
                href="#pricing"
                className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-primary-container border border-light-on-primary/15 text-light-on-primary hover:bg-light-on-primary/10 active:scale-95 transition-colors"
              >
                <span className="font-body text-label-lg">{secondaryCta}</span>
              </a>
            </div>
          </div>

          {/* Right 5 Cols: Floating Workspace Launch Card */}
          <div className="lg:col-span-5 bg-light-primary-container rounded-xl border border-light-on-primary/15 p-gutter-lg flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between gap-gutter-sm">
              <span className="font-headline text-title-md text-light-on-primary">
                {card.title}
              </span>
              <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-light-secondary text-light-on-secondary">
                {card.badge}
              </span>
            </div>
            <div className="flex flex-col gap-gutter-sm">
              {card.checklist.map((item) => (
                <div
                  key={item}
                  className="bg-light-primary/60 rounded-lg px-gutter-md py-gutter-sm flex items-center justify-between gap-gutter-sm"
                >
                  <span className="font-body text-body-sm text-light-on-primary">{item}</span>
                  <MaterialIcon name="check_circle" size={17} className="text-dark-mint shrink-0" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-gutter-xs border-t border-light-on-primary/10">
              <div className="flex -space-x-2">
                {card.avatars.map((person) => (
                  <Avatar
                    key={person.name}
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-7 h-7 border border-light-primary"
                  />
                ))}
              </div>
              <span className="font-mono text-mono-sm text-light-on-primary/70 tabular-nums">
                {card.footerMetric}
              </span>
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
