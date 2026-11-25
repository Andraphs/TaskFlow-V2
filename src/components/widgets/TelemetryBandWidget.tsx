import type { TelemetryMetricItem } from '../../data/mockData';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface TelemetryBandWidgetProps {
  statusLabel: string;
  caption: string;
  metrics: TelemetryMetricItem[];
  immediate?: boolean;
}

export function TelemetryBandWidget({
  statusLabel,
  caption,
  metrics,
  immediate = false,
}: TelemetryBandWidgetProps) {
  return (
    <section className="max-w-[1120px] mx-auto px-page-margin py-8">
      <RevealSection immediate={immediate}>
        <div className="bg-light-primary text-light-on-primary rounded-xl p-gutter-xl md:p-10 flex flex-col gap-gutter-lg shadow-[0_24px_56px_-18px_rgba(8,12,22,0.28)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-sm">
              <span className="relative inline-block w-2 h-2 rounded-full bg-dark-mint ping-dot" />
              <span className="font-body text-label-sm text-dark-mint">{statusLabel}</span>
            </div>
            <span className="font-mono text-mono-sm text-light-on-primary/65 tabular-nums">
              {caption}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="bento-3d bg-light-primary-container rounded-xl border border-light-on-primary/10 p-gutter-lg flex flex-col justify-between gap-gutter-md"
              >
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${metric.iconBgClass} ${metric.iconTextClass}`}
                  >
                    <MaterialIcon name={metric.icon} size={18} />
                  </span>
                  <span
                    className={`font-mono text-mono-sm px-gutter-sm py-0.5 rounded-full bg-light-primary tabular-nums ${metric.badgeTextClass}`}
                  >
                    {metric.badge}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-headline text-display-lg text-light-on-primary tabular-nums">
                    {metric.value}
                  </span>
                  <span className="font-body text-body-sm text-light-on-primary/80">
                    {metric.description}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-light-primary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.barColorClass}`}
                    style={{ width: `${metric.progressPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
