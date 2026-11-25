import type { IntegrationCardItem, WebhookEventItem } from '../../data/mockData';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface IntegrationsHubWidgetProps {
  eyebrow: string;
  headline: string;
  description: string;
  hubStatusLabel: string;
  hubLatency: string;
  hubFooterLeft: string;
  hubFooterCta: string;
  events: WebhookEventItem[];
  cards: IntegrationCardItem[];
  onExploreApi?: () => void;
  immediate?: boolean;
}

export function IntegrationsHubWidget({
  eyebrow,
  headline,
  description,
  hubStatusLabel,
  hubLatency,
  hubFooterLeft,
  hubFooterCta,
  events,
  cards,
  onExploreApi,
  immediate = false,
}: IntegrationsHubWidgetProps) {
  return (
    <section
      id="integrations"
      className="scroll-mt-20 max-w-[1120px] mx-auto px-page-margin py-16 flex flex-col gap-gutter-xl"
    >
      <RevealSection immediate={immediate}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
          <div className="max-w-[540px] flex flex-col gap-gutter-sm">
            <span className="font-body text-label-sm text-light-secondary">{eyebrow}</span>
            <h2 className="font-headline text-headline-lg text-light-primary text-balance">
              {headline}
            </h2>
          </div>
          <p className="font-body text-body-md text-light-on-surface-variant max-w-[360px]">
            {description}
          </p>
        </div>
      </RevealSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
        {/* Left 5 Cols: Dark Live Webhook Hub */}
        <RevealSection immediate={immediate} delay={0.03} className="lg:col-span-5 flex">
          <article className="w-full bento-3d bg-light-primary text-light-on-primary rounded-xl p-gutter-xl flex flex-col justify-between gap-gutter-lg">
            <div className="flex items-center justify-between gap-gutter-sm">
              <div className="inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-full bg-light-primary-container border border-dark-mint/30">
                <span className="relative inline-block w-2 h-2 rounded-full bg-dark-mint ping-dot" />
                <span className="font-body text-label-sm text-dark-mint">{hubStatusLabel}</span>
              </div>
              <span className="font-mono text-mono-sm text-light-on-primary/70 tabular-nums">
                {hubLatency}
              </span>
            </div>

            <div className="flex flex-col gap-gutter-sm">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-light-primary-container rounded-lg p-gutter-md border border-light-on-primary/10 flex items-center justify-between gap-gutter-sm"
                >
                  <div className="flex items-center gap-gutter-sm min-w-0">
                    <span
                      className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${event.iconBgClass} ${event.iconTextClass}`}
                    >
                      <MaterialIcon name={event.icon} size={16} />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body text-body-sm text-light-on-primary truncate">
                        {event.title}
                      </span>
                      <span className="font-mono text-mono-sm text-light-on-primary/65 truncate tabular-nums">
                        {event.meta}
                      </span>
                    </div>
                  </div>
                  {event.statusType === 'arrow' && (
                    <MaterialIcon
                      name="arrow_forward"
                      size={18}
                      className="text-dark-mint shrink-0"
                    />
                  )}
                  {event.statusType === 'pill' && (
                    <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-light-surface-container-lowest text-light-primary shrink-0">
                      {event.statusText}
                    </span>
                  )}
                  {event.statusType === 'check' && (
                    <MaterialIcon
                      name="check_circle"
                      size={18}
                      className="text-dark-mint shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-gutter-sm pt-gutter-sm border-t border-light-on-primary/15">
              <span className="font-body text-body-sm text-light-on-primary/80">
                {hubFooterLeft}
              </span>
              {onExploreApi ? (
                <button
                  type="button"
                  onClick={onExploreApi}
                  className="py-1.5 -my-1.5 font-body text-label-sm text-dark-mint hover:underline shrink-0"
                >
                  {hubFooterCta}
                </button>
              ) : (
                <a
                  href="#cta"
                  className="py-1.5 -my-1.5 font-body text-label-sm text-dark-mint hover:underline shrink-0"
                >
                  {hubFooterCta}
                </a>
              )}
            </div>
          </article>
        </RevealSection>

        {/* Right 7 Cols: 6 Integration Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter-md">
          {cards.map((card, idx) => (
            <RevealSection
              key={card.id}
              immediate={immediate}
              delay={0.04 + (idx % 3) * 0.03}
              className="flex"
            >
              <div className="w-full bento-3d bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-lg flex flex-col justify-between gap-gutter-md">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.iconBgClass} ${card.iconTextClass}`}
                  >
                    <MaterialIcon name={card.icon} size={19} />
                  </span>
                  <span
                    className={`font-body text-label-sm px-gutter-sm py-0.5 rounded-full ${card.badgeBgClass} ${card.badgeTextClass}`}
                  >
                    {card.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline text-title-md text-light-on-surface">{card.name}</h3>
                  <p className="font-body text-body-sm text-light-on-surface-variant mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
