import { useEffect, useId, useRef, useState } from 'react';
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

function formatTimerAria(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes} minutes ${seconds} seconds remaining`;
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
  const defaultSeconds = Math.max(0, Math.floor(initialSeconds));
  const [secondsLeft, setSecondsLeft] = useState<number>(defaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');
  const intervalRef = useRef<number | null>(null);
  const timerId = useId();

  const isControlled = secondsOverride !== undefined;
  const displayedSeconds = isControlled
    ? Math.max(0, Math.floor(secondsOverride))
    : secondsLeft;
  const isCompleted = displayedSeconds === 0;
  const runningState = isCompleted ? false : (isRunningOverride ?? isRunning);

  useEffect(() => {
    setSecondsLeft(defaultSeconds);
    setIsRunning(false);
    setStatusAnnouncement('');
  }, [defaultSeconds]);

  useEffect(() => {
    if (isControlled || !isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isControlled, isRunning]);

  useEffect(() => {
    if (isControlled) return;
    if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      setStatusAnnouncement('Focus session complete. Timer reached 00:00.');
    }
  }, [isControlled, isRunning, secondsLeft]);

  const handleToggle = () => {
    if (isControlled) return;

    if (secondsLeft === 0) {
      setSecondsLeft(defaultSeconds);
      setIsRunning(true);
      setStatusAnnouncement(`New focus session started, ${formatTimer(defaultSeconds)} remaining.`);
      return;
    }

    if (isRunning) {
      setIsRunning(false);
      setStatusAnnouncement(`Focus timer paused at ${formatTimer(secondsLeft)}.`);
      return;
    }

    setIsRunning(true);
    setStatusAnnouncement(
      secondsLeft === defaultSeconds
        ? `Focus timer started, ${formatTimer(secondsLeft)} remaining.`
        : `Focus timer resumed, ${formatTimer(secondsLeft)} remaining.`
    );
  };

  const formattedTime = formatTimer(displayedSeconds);
  const iconName = isCompleted ? 'replay' : runningState ? 'pause' : 'play_arrow';
  const buttonLabel = isCompleted
    ? 'Restart focus timer'
    : runningState
      ? 'Pause focus timer'
      : 'Start focus timer';

  const buttonStateClass = isCompleted
    ? 'focus-timer-btn-complete shadow-[0_10px_24px_-6px_rgba(82,32,229,0.55),0_0_0_4px_rgba(82,32,229,0.2)]'
    : runningState
      ? 'focus-timer-btn-running shadow-[0_12px_28px_-6px_rgba(82,32,229,0.6),0_0_0_4px_rgba(82,32,229,0.16)]'
      : 'shadow-[0_10px_24px_-6px_rgba(82,32,229,0.5)]';

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
        <div className="flex flex-col min-w-0">
          <span className="font-body text-label-sm text-light-on-surface-variant">
            {sessionLabel}
          </span>
          <div className="flex items-center gap-gutter-sm">
            <time
              id={timerId}
              role="timer"
              aria-atomic="true"
              aria-live="off"
              aria-label={formatTimerAria(displayedSeconds)}
              dateTime={`PT${Math.floor(displayedSeconds / 60)}M${displayedSeconds % 60}S`}
              className="font-headline text-display-lg-mobile text-light-primary tabular-nums"
            >
              {formattedTime}
            </time>
            {isCompleted && (
              <span className="focus-timer-badge-enter inline-flex items-center gap-1 font-body text-label-sm px-2 py-0.5 rounded-full bg-mint-soft text-light-mint whitespace-nowrap">
                <MaterialIcon name="check_circle" size={14} />
                Done
              </span>
            )}
          </div>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {statusAnnouncement}
          </span>
        </div>
        <div className="flex items-center gap-gutter-sm shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={buttonLabel}
            aria-pressed={isCompleted ? undefined : runningState}
            aria-controls={timerId}
            title={buttonLabel}
            className={`focus-timer-btn relative w-12 h-12 rounded-full bg-light-secondary text-light-on-secondary flex items-center justify-center hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-secondary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ${buttonStateClass}`}
          >
            <span
              key={iconName}
              className="focus-timer-icon-swap inline-flex items-center justify-center"
            >
              <MaterialIcon name={iconName} size={24} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
