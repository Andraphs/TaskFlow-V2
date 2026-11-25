import { useState } from 'react';
import type { ChecklistTaskItem } from '../../data/mockData';
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
  const [animatedTaskIds, setAnimatedTaskIds] = useState<Record<string, boolean>>({});

  const activeCompletedIds = controlledCompletedIds ?? internalCompletedIds;
  const doneCount = tasks.filter((t) => activeCompletedIds.includes(t.id)).length;
  const progressRatio = tasks.length > 0 ? doneCount / tasks.length : 0;

  const handleToggle = (taskId: string) => {
    const wasChecked = activeCompletedIds.includes(taskId);

    if (controlledCompletedIds === undefined) {
      setInternalCompletedIds((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
    }

    setAnimatedTaskIds((prev) => {
      if (!wasChecked) {
        return { ...prev, [taskId]: true };
      }
      if (!prev[taskId]) return prev;
      const next = { ...prev };
      delete next[taskId];
      return next;
    });

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
        <span
          aria-live="polite"
          className="font-mono text-mono-sm px-gutter-md py-1 rounded-full bg-light-primary-container text-light-on-primary tabular-nums shrink-0"
        >
          {doneCount} / {tasks.length} done
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Task completion"
        aria-valuemin={0}
        aria-valuemax={tasks.length}
        aria-valuenow={doneCount}
        className="w-full h-1.5 rounded-full bg-light-primary-container overflow-hidden"
      >
        <div
          style={{ transform: `scaleX(${progressRatio})` }}
          className="h-full w-full rounded-full bg-dark-mint task-progress-fill"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-gutter-sm">
        {tasks.map((task) => {
          const isCompleted = activeCompletedIds.includes(task.id);
          const shouldAnimate = isCompleted && Boolean(animatedTaskIds[task.id]);

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => handleToggle(task.id)}
              aria-pressed={isCompleted}
              className={`relative w-full text-left cursor-pointer bg-light-primary-container hover:bg-light-on-primary/10 rounded-xl border p-gutter-md flex items-center justify-between gap-gutter-md transition-all duration-150 active:scale-[0.99] ${
                isCompleted ? 'border-dark-mint/30 opacity-75' : 'border-light-on-primary/10'
              }`}
            >
              <span className="pointer-events-none flex items-center gap-gutter-md min-w-0">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'border-dark-mint bg-dark-mint'
                      : `${task.accentRingClass} bg-transparent`
                  } ${shouldAnimate ? 'task-check-ripple' : ''}`}
                >
                  {isCompleted && (
                    <MaterialIcon
                      name="check"
                      size={14}
                      className={`pointer-events-none text-light-primary ${
                        shouldAnimate ? 'task-check-pop' : ''
                      }`}
                    />
                  )}
                </span>
                <span
                  className={`pointer-events-none font-body text-title-md text-light-on-primary truncate ${
                    isCompleted ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </span>
              </span>
              <span
                className={`pointer-events-none font-mono text-mono-sm shrink-0 ${
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
