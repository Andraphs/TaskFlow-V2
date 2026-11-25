import { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface MobileSyncWidgetProps {
  eyebrow: string;
  title: string;
  description: string;
  badges: { icon: string; iconColorClass: string; label: string }[];
  companionTitle: string;
  latencyLabel: string;
  meetingTitle: string;
  meetingMeta: string;
  navIcons: readonly string[];
  /** Controlled joined state for Remotion scenes */
  joinedOverride?: boolean;
  onJoinToggle?: (nextJoined: boolean) => void;
  className?: string;
}

export function MobileSyncWidget({
  eyebrow,
  title,
  description,
  badges,
  companionTitle,
  latencyLabel,
  meetingTitle,
  meetingMeta,
  navIcons,
  joinedOverride,
  onJoinToggle,
  className = '',
}: MobileSyncWidgetProps) {
  const [internalJoined, setInternalJoined] = useState(false);
  const joined = joinedOverride ?? internalJoined;

  const handleToggle = () => {
    const next = !joined;
    if (joinedOverride === undefined) {
      setInternalJoined(next);
    }
    onJoinToggle?.(next);
  };

  return (
    <article
      className={`bento-3d bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-xl grid grid-cols-1 md:grid-cols-12 gap-gutter-lg items-center ${className}`}
    >
      <div className="md:col-span-7 flex flex-col gap-gutter-sm">
        <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-sky-soft text-light-on-sky-container w-fit">
          {eyebrow}
        </span>
        <h3 className="font-headline text-headline-md text-light-on-surface">{title}</h3>
        <p className="font-body text-body-sm text-light-on-surface-variant text-pretty">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-gutter-sm pt-gutter-xs">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1 px-gutter-md py-1 rounded-full bg-neutral-canvas font-body text-label-sm text-light-on-surface"
            >
              <MaterialIcon name={badge.icon} size={15} className={badge.iconColorClass} />
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-5 bg-neutral-canvas rounded-xl p-gutter-md flex flex-col gap-gutter-sm border border-light-outline-variant/40">
        <div className="flex items-center justify-between">
          <span className="font-body text-label-sm text-light-on-surface">{companionTitle}</span>
          <span className="inline-flex items-center gap-1 px-gutter-sm py-0.5 rounded-full bg-mint-soft text-light-mint font-mono text-mono-sm tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-light-mint" />
            {latencyLabel}
          </span>
        </div>

        <div className="bg-light-surface-container-lowest rounded-lg p-gutter-sm flex items-center justify-between gap-gutter-sm shadow-sm">
          <div className="flex flex-col min-w-0">
            <span className="font-body text-body-sm text-light-on-surface truncate">
              {meetingTitle}
            </span>
            <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
              {meetingMeta}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={joined}
            aria-label={joined ? `Leave ${meetingTitle}` : `Join ${meetingTitle}`}
            className={`min-h-[32px] px-gutter-md py-1.5 rounded-full font-body text-label-sm transition-all active:scale-95 shrink-0 ${
              joined
                ? 'bg-mint-soft text-light-mint'
                : 'bg-light-primary text-light-on-primary hover:opacity-90'
            }`}
          >
            {joined ? 'Joined ✓' : 'Join'}
          </button>
        </div>

        <div className="bg-light-surface-container-lowest rounded-full px-gutter-md py-1.5 flex items-center justify-between text-light-on-surface-variant shadow-sm">
          {navIcons.map((icon, index) => {
            if (icon === 'add') {
              return (
                <span
                  key={icon}
                  className="w-6 h-6 rounded-full bg-light-secondary text-light-on-secondary flex items-center justify-center"
                >
                  <MaterialIcon name="add" size={14} />
                </span>
              );
            }
            return (
              <MaterialIcon
                key={icon}
                name={icon}
                size={16}
                className={index === 0 ? 'text-light-primary' : ''}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}
