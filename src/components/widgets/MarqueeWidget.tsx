import type { MarqueeTeamItem } from '../../data/mockData';
import { MaterialIcon } from './MaterialIcon';

export interface MarqueeWidgetProps {
  caption: string;
  teams: MarqueeTeamItem[];
}

export function MarqueeWidget({ caption, teams }: MarqueeWidgetProps) {
  // Duplicate set to ensure seamless marquee width across ultra-wide viewports
  const rowItems = [...teams, ...teams];

  return (
    <section
      aria-label="Trusted product and engineering teams"
      className="border-y border-light-outline-variant/40 bg-light-surface-container-lowest/70 py-gutter-lg overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-page-margin mb-gutter-md text-center">
        <span className="font-body text-label-sm text-light-on-surface-variant">
          {caption}
        </span>
      </div>
      <div className="relative w-full overflow-hidden py-1">
        <div className="marquee-track flex items-center">
          <div className="marquee-group-primary flex items-center shrink-0 gap-gutter-xl pr-gutter-xl">
            {rowItems.map((team, index) => {
              const isDuplicate = index >= teams.length;
              return (
                <div
                  key={`set1-${team.name}-${index}`}
                  aria-hidden={isDuplicate || undefined}
                  className={`flex items-center shrink-0 whitespace-nowrap gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-neutral-canvas${
                    isDuplicate ? ' marquee-duplicate' : ''
                  }`}
                >
                  <MaterialIcon name={team.icon} size={18} className={team.iconColorClass} />
                  <span className="font-headline text-title-md text-light-on-surface">
                    {team.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            className="marquee-duplicate flex items-center shrink-0 gap-gutter-xl pr-gutter-xl"
            aria-hidden="true"
          >
            {rowItems.map((team, index) => (
              <div
                key={`set2-${team.name}-${index}`}
                className="flex items-center shrink-0 whitespace-nowrap gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-neutral-canvas"
              >
                <MaterialIcon name={team.icon} size={18} className={team.iconColorClass} />
                <span className="font-headline text-title-md text-light-on-surface">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
