import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';

export interface WorkspaceModalWidgetProps {
  isOpen: boolean;
  selectedPlan?: string;
  onClose: () => void;
}

export function WorkspaceModalWidget({
  isOpen,
  selectedPlan = 'Starter',
  onClose,
}: WorkspaceModalWidgetProps) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceName.trim() || !workEmail.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workspace-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-light-primary/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: stitchMotion.easeHeavyDecel }}
            className="relative z-10 w-full max-w-[440px] bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/60 p-gutter-xl shadow-[0_32px_72px_-20px_rgba(8,12,22,0.38)] flex flex-col gap-gutter-lg"
          >
            <div className="flex items-start justify-between gap-gutter-md">
              <div className="flex flex-col gap-1">
                <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-secondary-soft text-light-secondary w-fit">
                  {selectedPlan} Plan
                </span>
                <h3
                  id="workspace-modal-title"
                  className="font-headline text-headline-md text-light-primary"
                >
                  {submitted ? 'Workspace Ready' : 'Launch your TaskFlow workspace'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-neutral-canvas text-light-on-surface-variant hover:text-light-primary flex items-center justify-center transition-colors"
              >
                <MaterialIcon name="close" size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col gap-gutter-md">
                <div className="bg-light-surface rounded-lg border border-light-mint/30 p-gutter-md flex items-start gap-gutter-sm">
                  <MaterialIcon name="check_circle" size={20} className="text-light-mint shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-headline text-title-md text-light-on-surface">
                      {workspaceName} initialized
                    </span>
                    <span className="font-body text-body-sm text-light-on-surface-variant">
                      Invitation &amp; Sprint 15 kickoff template sent to{' '}
                      <strong className="text-light-on-surface">{workEmail}</strong>.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-gutter-md rounded-full bg-light-primary text-light-on-primary font-body text-label-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Back to TaskFlow
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="tf-workspace-name"
                    className="font-body text-label-sm text-light-on-surface"
                  >
                    Squad or workspace name
                  </label>
                  <input
                    id="tf-workspace-name"
                    type="text"
                    required
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g. Kinetix Product Squad"
                    className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-gutter-md py-2.5 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-secondary focus:ring-light-secondary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="tf-work-email"
                    className="font-body text-label-sm text-light-on-surface"
                  >
                    Work email
                  </label>
                  <input
                    id="tf-work-email"
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="nadia@kinetix.io"
                    className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-gutter-md py-2.5 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-secondary focus:ring-light-secondary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-1 py-gutter-md rounded-full bg-light-secondary text-light-on-secondary font-body text-label-lg shadow-[0_12px_28px_-8px_rgba(82,32,229,0.45)] hover:opacity-95 active:scale-95 transition-all inline-flex items-center justify-center gap-gutter-xs"
                >
                  <span>Create Free Workspace</span>
                  <MaterialIcon name="arrow_forward" size={16} />
                </button>
                <p className="text-center font-body text-body-sm text-light-on-surface-variant">
                  No credit card required · Ready in 60 seconds
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
