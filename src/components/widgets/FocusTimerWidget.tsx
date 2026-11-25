import { useEffect, useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface FocusTimerWidgetProps {
  eyebrow: string;
  syncBadge: string;
  title: string;
  description: string;
  sessionLabel: string;
  initialSeconds?: number;
  /** Controlled remaining seconds for Remotion frame rendering */
  secondsOverride?: number;
  isRunningOverride?: boolean;
  className?: string;
}

function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function FocusTimerWidget({
  eyebrow,
  syncBadge,
  title,
  description,
  sessionLabel,
  initialSeconds = 25 * 60,
  secondsOverride,
  isRunningOverride,
  className = '',
}: FocusTimerWidgetProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const displayedSeconds = secondsOverride ?? secondsLeft;
  const runningState = isRunningOverride ?? isRunning;

  useEffect(() => {
    if (secondsOverride !== undefined || !isRunning) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, secondsOverride]);

  const handleToggle = () => {
    if (secondsOverride !== undefined) return;
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  return (
    <article
      className={`bento-3d bg-secondary-soft rounded-xl border border-light-secondary/20 p-gutter-xl flex flex-col justify-between gap-gutter-lg ${className}`}
    >
      <div className="flex items-start justify-between gap-gutter-sm">
        <div className="flex flex-col gap-gutter-xs">
          <div className="flex items-center gap-gutter-sm">
            <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-light-surface-container-lowest text-light-secondary">
              {eyebrow}
            </span>
            <span className="inline-flex items-center gap-1.5 font-body text-label-sm text-light-on-surface-variant">
              <span className="relative inline-block w-2 h-2 rounded-full bg-light-secondary ping-dot" />
              {syncBadge}
            </span>
          </div>
          <h3 className="font-headline text-headline-md text-light-on-surface">{title}</h3>
          <p className="font-body text-body-sm text-light-on-surface-variant">{description}</p>
        </div>
      </div>

      <div className="bg-light-surface-container-lowest rounded-xl p-gutter-lg flex items-center justify-between gap-gutter-md shadow-sm border border-light-secondary/15">
        <div className="flex flex-col">
          <span className="font-body text-label-sm text-light-on-surface-variant">
            {sessionLabel}
          </span>
          <span className="font-headline text-display-lg-mobile text-light-primary tabular-nums">
            {formatTimer(displayedSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={runningState ? 'Pause focus timer' : 'Start focus timer'}
            aria-pressed={runningState}
            className="w-12 h-12 rounded-full bg-light-secondary text-light-on-secondary flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(82,32,229,0.5)] hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            <MaterialIcon name={runningState ? 'pause' : 'play_arrow'} size={24} />
          </button>
        </div>
      </div>
    </article>
  );
}
