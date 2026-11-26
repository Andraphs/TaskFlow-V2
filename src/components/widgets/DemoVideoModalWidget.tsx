import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';

export interface DemoVideoModalWidgetProps {
  isOpen: boolean;
  videoSrc: string;
  posterSrc?: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onTryDashboard?: () => void;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], video, [tabindex]:not([tabindex="-1"])';

export function DemoVideoModalWidget({
  isOpen,
  videoSrc,
  posterSrc,
  title = 'TaskFlow UI Motion Showcase',
  subtitle = 'taskflow-showcase-v7 · 60fps interactive product walkthrough',
  onClose,
  onTryDashboard,
}: DemoVideoModalWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setHasError(false);
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      const container = dialogRef.current;
      if (!container) return;
      const closeBtn = container.querySelector<HTMLElement>('button[aria-label="Close video modal"]');
      (closeBtn ?? container).focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!active || active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (!active || active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-video-modal-title"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-light-primary/70 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: stitchMotion.easeHeavyDecel }
            }
            className="relative z-10 w-full max-w-[960px] bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/60 p-gutter-lg sm:p-gutter-xl shadow-[0_36px_84px_-20px_rgba(8,12,22,0.45)] flex flex-col gap-gutter-md outline-none"
          >
            <div className="flex items-start justify-between gap-gutter-md">
              <div className="flex flex-col gap-1">
                <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-secondary-soft text-light-secondary w-fit">
                  Motion Showcase
                </span>
                <h3
                  id="demo-video-modal-title"
                  className="font-headline text-headline-md text-light-primary"
                >
                  {title}
                </h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close video modal"
                className="w-9 h-9 rounded-full bg-neutral-canvas text-light-on-surface-variant hover:text-light-primary flex items-center justify-center transition-colors shrink-0"
              >
                <MaterialIcon name="close" size={18} />
              </button>
            </div>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-light-primary border border-light-outline-variant/40">
              {hasError ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-gutter-xl gap-gutter-sm text-light-on-primary">
                  <MaterialIcon name="videocam_off" size={32} className="text-dark-secondary" />
                  <p className="font-headline text-title-lg">
                    Showcase video not found
                  </p>
                  <p className="font-body text-body-sm text-light-on-primary/75 max-w-[440px]">
                    Place <code className="font-mono text-dark-mint">taskflow-showcase-v7.mp4</code>{' '}
                    inside <code className="font-mono text-dark-mint">public/videos/</code> to play
                    the motion showcase here.
                  </p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={posterSrc}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onError={() => setHasError(true)}
                  className="w-full h-full object-contain bg-light-primary"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-gutter-sm pt-1">
              <span className="font-mono text-mono-sm text-light-on-surface-variant">
                Press Esc to close
              </span>
              <div className="flex items-center gap-gutter-sm">
                {onTryDashboard && (
                  <button
                    type="button"
                    onClick={onTryDashboard}
                    className="inline-flex items-center gap-gutter-xs px-gutter-lg py-gutter-sm rounded-full bg-light-secondary text-light-on-secondary font-body text-label-lg hover:opacity-95 active:scale-95 transition-all"
                  >
                    <span>Open Live Dashboard</span>
                    <MaterialIcon name="arrow_forward" size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-gutter-lg py-gutter-sm rounded-full bg-neutral-canvas text-light-on-surface font-body text-label-lg hover:bg-light-surface-variant active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
