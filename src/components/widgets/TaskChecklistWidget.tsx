import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChecklistTaskItem } from '../../data/mockData';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';

export interface TaskChecklistWidgetProps {
  tasks: ChecklistTaskItem[];
  /** Controlled completed IDs for deterministic Remotion playback */
  completedIds?: string[];
  onToggleTask?: (taskId: string) => void;
  eyebrow?: string;
  title?: string;
  className?: string;
}

export function TaskChecklistWidget({
  tasks,
  completedIds: controlledCompletedIds,
  onToggleTask,
  eyebrow = 'Interactive Demo',
  title = 'Tactile Task Checklists',
  className = '',
}: TaskChecklistWidgetProps) {
  const [internalCompletedIds, setInternalCompletedIds] = useState<string[]>(() =>
    tasks.filter((t) => t.defaultCompleted).map((t) => t.id)
  );

  const activeCompletedIds = controlledCompletedIds ?? internalCompletedIds;
  const doneCount = tasks.filter((t) => activeCompletedIds.includes(t.id)).length;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleToggle = (taskId: string) => {
    if (controlledCompletedIds === undefined) {
      setInternalCompletedIds((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
    }
    onToggleTask?.(taskId);
  };

  return (
    <article
      className={`bento-3d bg-light-primary text-light-on-primary rounded-xl p-gutter-xl flex flex-col justify-between gap-gutter-lg shadow-[0_24px_54px_-18px_rgba(8,12,22,0.28)] ${className}`}
    >
      <div className="flex items-start justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <span className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-light-primary-container text-dark-mint border border-dark-mint/30 w-fit">
            {eyebrow}
          </span>
          <h3 className="font-headline text-headline-md text-light-on-primary">{title}</h3>
        </div>
        <span className="font-mono text-mono-sm px-gutter-md py-1 rounded-full bg-light-primary-container text-light-on-primary tabular-nums shrink-0">
          {doneCount} / {tasks.length} done
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-light-primary-container overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.32, ease: stitchMotion.easeHeavyDecel }}
          className="h-full rounded-full bg-dark-mint"
        />
      </div>

      <div className="flex flex-col gap-gutter-sm">
        {tasks.map((task) => {
          const isCompleted = activeCompletedIds.includes(task.id);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => handleToggle(task.id)}
              aria-pressed={isCompleted}
              className={`w-full text-left bg-light-primary-container hover:bg-light-on-primary/10 rounded-xl border p-gutter-md flex items-center justify-between gap-gutter-md transition-all duration-150 active:scale-[0.99] ${
                isCompleted ? 'border-dark-mint/30 opacity-75' : 'border-light-on-primary/10'
              }`}
            >
              <div className="flex items-center gap-gutter-md min-w-0">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'border-dark-mint bg-dark-mint'
                      : `${task.accentRingClass} bg-transparent`
                  }`}
                >
                  {isCompleted && (
                    <MaterialIcon name="check" size={14} className="text-light-primary" />
                  )}
                </span>
                <span
                  className={`font-body text-title-md text-light-on-primary truncate ${
                    isCompleted ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <span
                className={`font-mono text-mono-sm shrink-0 ${
                  isCompleted ? 'text-dark-mint' : 'text-light-on-primary/60'
                }`}
              >
                {task.tag}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
