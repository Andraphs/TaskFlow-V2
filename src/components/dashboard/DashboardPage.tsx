import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  type ChatMessageItem,
  type DashboardTaskItem,
  type DashboardTimeframe,
  type SprintTabId,
  dashboardCalendarDays,
  dashboardMeetings,
  dashboardPeople,
  dashboardTeamMembers,
  dashboardTimeframes,
  dashboardVelocityByPeriod,
  initialChatMessages,
  initialDashboardTasks,
  sidebarNavItems,
  sprintTabPanels,
  weeklyProgressSnapshot,
} from '../../data/dashboardData';
import { stitchMotion } from '../../tokens/designTokens';
import { Avatar, MaterialIcon } from '../widgets';

export interface DashboardPageProps {
  onBackToLanding: () => void;
}

const TIMEFRAME_STORAGE_KEY = 'taskflow-dashboard-timeframe';
const SPRINT_TABS: SprintTabId[] = ['todo', 'progress', 'review'];
const CALENDAR_MONTHS = ['October 2026', 'November 2026', 'December 2026'] as const;
const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

function readInitialTimeframe(): DashboardTimeframe {
  try {
    const saved = window.sessionStorage.getItem(TIMEFRAME_STORAGE_KEY);
    if (saved === 'today' || saved === 'week' || saved === 'month') {
      return saved;
    }
  } catch {
    // Ignore storage access restrictions
  }
  return 'week';
}

const TASK_TONE_STYLES: Record<
  DashboardTaskItem['tone'],
  { cardBg: string; border: string; badge: string; timeText: string }
> = {
  tertiary: {
    cardBg: 'bg-tertiary-soft',
    border: 'border-light-tertiary',
    badge: 'text-light-on-tertiary-container bg-light-tertiary-container',
    timeText: 'text-light-on-tertiary-container',
  },
  sky: {
    cardBg: 'bg-sky-soft',
    border: 'border-light-sky',
    badge: 'text-light-on-sky-container bg-light-sky-container',
    timeText: 'text-light-on-sky-container',
  },
  secondary: {
    cardBg: 'bg-secondary-soft',
    border: 'border-light-secondary',
    badge: 'text-light-on-secondary-container bg-light-secondary-container',
    timeText: 'text-light-on-secondary-container',
  },
  mint: {
    cardBg: 'bg-mint-soft',
    border: 'border-light-mint',
    badge: 'text-light-on-mint-container bg-light-mint-container',
    timeText: 'text-light-on-mint-container',
  },
};

const CALENDAR_DAY_TONES: Record<NonNullable<(typeof dashboardCalendarDays)[number]['tone']>, string> = {
  tertiary: 'text-light-on-tertiary-container bg-tertiary-soft',
  secondary: 'text-light-on-secondary-container bg-secondary-soft',
  primary: 'text-light-on-primary bg-light-primary shadow-sm',
  coral: 'text-light-on-coral-container bg-coral-soft',
  mint: 'text-light-on-mint-container bg-mint-soft',
};

const CHAT_BUBBLE_STYLES = {
  sky: {
    bg: 'bg-sky-soft/70',
    name: 'text-light-on-sky-container',
    time: 'text-light-on-surface-variant',
    text: 'text-light-on-surface',
  },
  secondary: {
    bg: 'bg-secondary-soft',
    name: 'text-light-on-secondary-container',
    time: 'text-light-on-secondary-container/80',
    text: 'text-light-on-secondary-container',
  },
  mint: {
    bg: 'bg-mint-soft/70',
    name: 'text-light-on-mint-container',
    time: 'text-light-on-mint-container/80',
    text: 'text-light-on-mint-container',
  },
} as const;

export function DashboardPage({ onBackToLanding }: DashboardPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<DashboardTimeframe>(readInitialTimeframe);
  const [taskDayFilter, setTaskDayFilter] = useState<'all' | 'today' | 'tomorrow'>(() =>
    readInitialTimeframe() === 'today' ? 'today' : 'all',
  );
  const [tasks, setTasks] = useState<DashboardTaskItem[]>(initialDashboardTasks);
  const [recentlyCheckedId, setRecentlyCheckedId] = useState<string | null>(null);

  const [activeSprintTab, setActiveSprintTab] = useState<SprintTabId>('todo');
  const [activeVelocityIndex, setActiveVelocityIndex] = useState<number>(
    () => dashboardVelocityByPeriod[readInitialTimeframe()].defaultActiveIndex,
  );

  const [calendarMonthIdx, setCalendarMonthIdx] = useState<number>(1); // November 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(22);

  const [joinedMeetingIds, setJoinedMeetingIds] = useState<Record<string, boolean>>({});

  // Focus Timer (25:00)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Team Chat
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState('');

  // Notifications popover
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const notifWrapperRef = useRef<HTMLDivElement>(null);

  // New Task Modal
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const taskInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeframeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dayFilterRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sprintTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Persist active timeframe across navigation/reload
  useEffect(() => {
    try {
      window.sessionStorage.setItem(TIMEFRAME_STORAGE_KEY, timeframe);
    } catch {
      // Ignore storage write restrictions
    }
  }, [timeframe]);

  const handleSelectTimeframe = (next: DashboardTimeframe) => {
    setTimeframe(next);
    setTaskDayFilter(next === 'today' ? 'today' : 'all');
    setActiveVelocityIndex(dashboardVelocityByPeriod[next].defaultActiveIndex);
  };

  const handleTimeframeKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIdx = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIdx = (index + 1) % dashboardTimeframes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIdx = (index - 1 + dashboardTimeframes.length) % dashboardTimeframes.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = dashboardTimeframes.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const nextOption = dashboardTimeframes[nextIdx];
    handleSelectTimeframe(nextOption.id);
    timeframeRefs.current[nextIdx]?.focus();
  };

  const handleDayFilterKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const keys: Array<'today' | 'tomorrow'> = ['today', 'tomorrow'];
    let nextIdx = index;
    if (event.key === 'ArrowRight') nextIdx = (index + 1) % keys.length;
    else if (event.key === 'ArrowLeft') nextIdx = (index - 1 + keys.length) % keys.length;
    else if (event.key === 'Home') nextIdx = 0;
    else if (event.key === 'End') nextIdx = keys.length - 1;
    else return;
    event.preventDefault();
    setTaskDayFilter(keys[nextIdx]);
    dayFilterRefs.current[nextIdx]?.focus();
  };

  // Cmd/Ctrl + K focuses dashboard search
  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === 'Escape') {
        if (newTaskModalOpen) {
          setNewTaskModalOpen(false);
          setNewTaskTitle('');
        } else if (notifOpen) {
          setNotifOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [newTaskModalOpen, notifOpen]);

  // Close notifications popover on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (notifWrapperRef.current && !notifWrapperRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [notifOpen]);

  // Focus task title input when Create New Task modal opens
  useEffect(() => {
    if (newTaskModalOpen) {
      const id = window.setTimeout(() => taskInputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [newTaskModalOpen]);

  // Focus Timer interval
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const activeTimeframeMeta = useMemo(
    () => dashboardTimeframes.find((item) => item.id === timeframe) ?? dashboardTimeframes[1],
    [timeframe],
  );

  const todayTasks = useMemo(() => tasks.filter((task) => task.day === 'today'), [tasks]);

  const scopedTasks = useMemo(() => {
    if (taskDayFilter === 'all') return tasks;
    return tasks.filter((task) => task.day === taskDayFilter);
  }, [tasks, taskDayFilter]);

  const visibleTasks = useMemo(() => {
    if (!normalizedQuery) return scopedTasks;
    return scopedTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.category.toLowerCase().includes(normalizedQuery),
    );
  }, [scopedTasks, normalizedQuery]);

  const doneCount = useMemo(() => scopedTasks.filter((t) => t.done).length, [scopedTasks]);

  const sprintCardsByTabForPeriod = useMemo(() => {
    return {
      todo: sprintTabPanels.todo.cards.filter((card) => card.periods.includes(timeframe)),
      progress: sprintTabPanels.progress.cards.filter((card) => card.periods.includes(timeframe)),
      review: sprintTabPanels.review.cards.filter((card) => card.periods.includes(timeframe)),
    };
  }, [timeframe]);

  const activeSprintCards = useMemo(() => {
    const cards = sprintCardsByTabForPeriod[activeSprintTab];
    if (!normalizedQuery) return cards;
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(normalizedQuery) ||
        card.description.toLowerCase().includes(normalizedQuery) ||
        card.badge.toLowerCase().includes(normalizedQuery),
    );
  }, [sprintCardsByTabForPeriod, activeSprintTab, normalizedQuery]);

  const todayProgressSnapshot = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.done).length;
    const remaining = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const completedWidth = total > 0 ? (completed / total) * 100 : 0;
    const remainingWidth = total > 0 ? (remaining / total) * 100 : 0;
    return {
      percent,
      label: "Today's Task Completion",
      segments: [
        { colorClass: 'bg-light-mint', widthPercent: completedWidth },
        { colorClass: 'bg-light-secondary', widthPercent: remainingWidth },
      ].filter((seg) => seg.widthPercent > 0),
      stats: [
        { value: completed, label: 'Completed' },
        { value: remaining, label: 'Remaining' },
        { value: total, label: 'Total Today' },
      ],
      activeWeekdayIndex: 0, // Su (22 Nov)
      completedWeekdayIndices: [] as number[],
    };
  }, [todayTasks]);

  const activeProgressSnapshot =
    timeframe === 'today'
      ? todayProgressSnapshot
      : timeframe === 'week'
        ? weeklyProgressSnapshot
        : null;

  const velocityDataset = dashboardVelocityByPeriod[timeframe];

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nextDone = !task.done;
        if (nextDone) setRecentlyCheckedId(id);
        return { ...task, done: nextDone };
      }),
    );
  };

  const handleToggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(25 * 60);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((prev) => !prev);
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: dashboardPeople.andra,
        time,
        text: trimmed,
        outgoing: true,
      },
    ]);
    setChatInput('');
  };

  const handleCreateTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    const tones: DashboardTaskItem['tone'][] = ['tertiary', 'sky', 'secondary'];
    const nextTone = tones[tasks.length % tones.length];
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const created: DashboardTaskItem = {
      id: `task-${Date.now()}`,
      day: taskDayFilter === 'tomorrow' ? 'tomorrow' : 'today',
      category: 'Sprint',
      time: formattedTime,
      title: trimmed,
      description: 'Added directly from Task Dashboard quick composer.',
      done: false,
      tone: nextTone,
      cornerVariant: tasks.length % 2 === 0 ? 'a' : 'b',
    };
    setTasks((prev) => [created, ...prev]);
    setNewTaskTitle('');
    setNewTaskModalOpen(false);
  };

  const handleSprintTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIdx = index;
    if (event.key === 'ArrowRight') nextIdx = (index + 1) % SPRINT_TABS.length;
    else if (event.key === 'ArrowLeft') nextIdx = (index - 1 + SPRINT_TABS.length) % SPRINT_TABS.length;
    else if (event.key === 'Home') nextIdx = 0;
    else if (event.key === 'End') nextIdx = SPRINT_TABS.length - 1;
    else return;
    event.preventDefault();
    setActiveSprintTab(SPRINT_TABS[nextIdx]);
    sprintTabRefs.current[nextIdx]?.focus();
  };

  const handleVelocityPointerEnter = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType === 'touch') return;
    setActiveVelocityIndex(index);
  };

  const activeBar =
    velocityDataset.bars[activeVelocityIndex] ??
    velocityDataset.bars[velocityDataset.defaultActiveIndex] ??
    velocityDataset.bars[0];
  const clampedTooltipLeft = activeBar ? Math.min(84, Math.max(16, activeBar.posPercent)) : 50;

  const timerMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const timerSeconds = String(secondsLeft % 60).padStart(2, '0');

  const handleSidebarNavClick = (id: string, targetId: string) => {
    setActiveNav(id);
    if (targetId === 'dash-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div id="dash-top" className="min-h-screen bg-neutral-canvas text-light-on-surface font-body antialiased">
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[68px_1fr] p-gutter-md gap-gutter-md items-stretch">
        {/* Top-Left Brand Mark (returns to Landing Page) */}
        <div className="flex items-center justify-between lg:justify-center">
          <button
            type="button"
            onClick={onBackToLanding}
            aria-label="Back to TaskFlow Landing Page"
            title="Back to TaskFlow Home"
            className="w-11 h-11 rounded-md bg-light-primary text-light-on-primary flex items-center justify-center transition-all duration-state-change ease-state-change hover:scale-105 hover:shadow-md active:scale-95"
          >
            <MaterialIcon name="bolt" size={22} />
          </button>

          <button
            type="button"
            onClick={onBackToLanding}
            className="lg:hidden inline-flex items-center gap-gutter-xs px-gutter-md h-10 rounded-full bg-light-surface-container-lowest border border-light-outline-variant/50 text-light-on-surface hover:bg-light-surface transition-colors active:scale-95"
          >
            <MaterialIcon name="arrow_back" size={16} />
            <span className="font-body text-label-sm">Landing Page</span>
          </button>
        </div>

        {/* Top Header Bar */}
        <header className="bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/40 px-gutter-lg py-gutter-md flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-gutter-sm">
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Manage and track your team sprint
              </p>
              <span
                id="active-period-badge"
                aria-live="polite"
                className="font-body text-label-sm px-gutter-sm py-0.5 rounded-full bg-secondary-soft text-light-on-secondary-container whitespace-nowrap"
              >
                {activeTimeframeMeta.label} · {activeTimeframeMeta.rangeLabel}
              </span>
            </div>
            <h1 className="font-headline text-headline-lg text-light-on-surface">
              Task Dashboard
            </h1>
          </div>

          {/* Search & Timeframe Pill */}
          <div className="flex flex-wrap items-center gap-gutter-md w-full sm:w-auto">
            <div className="relative flex items-center bg-neutral-canvas rounded-full px-gutter-lg h-10 w-full sm:w-auto sm:min-w-[260px] transition-all duration-state-change focus-within:ring-2 focus-within:ring-light-secondary/30 focus-within:bg-light-surface-container-lowest">
              <MaterialIcon
                name="search"
                size={18}
                className="text-light-on-surface-variant mr-gutter-sm shrink-0"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, projects..."
                aria-label="Search tasks and projects"
                className="bg-transparent border-none p-0 focus:ring-0 font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant w-full"
              />
              <span className="font-mono text-mono-sm text-light-on-surface-variant bg-light-surface-container-lowest px-gutter-sm py-gutter-xs rounded-full ml-gutter-sm shrink-0">
                ⌘K
              </span>
            </div>

            <div
              className="flex items-center gap-gutter-xs bg-neutral-canvas p-gutter-xs rounded-full h-10 w-fit"
              role="radiogroup"
              aria-label="Timeframe filter"
            >
              {dashboardTimeframes.map((option, idx) => {
                const isActive = timeframe === option.id;
                return (
                  <button
                    key={option.id}
                    ref={(el) => {
                      timeframeRefs.current[idx] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleSelectTimeframe(option.id)}
                    onKeyDown={(e) => handleTimeframeKeyDown(e, idx)}
                    className={`relative h-full inline-flex items-center px-gutter-md rounded-full transition-colors duration-200 motion-reduce:transition-none active:scale-95 ${
                      isActive
                        ? 'text-light-on-primary'
                        : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container-lowest/60'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dashboard-timeframe-pill"
                        aria-hidden="true"
                        transition={
                          shouldReduceMotion ? { duration: 0 } : stitchMotion.springSnappy
                        }
                        className="absolute inset-0 rounded-full bg-light-primary shadow-sm pointer-events-none"
                      />
                    )}
                    <span className="relative z-10 font-body text-label-sm whitespace-nowrap">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Global Actions & Profile */}
          <div className="flex items-center gap-gutter-md">
            <div ref={notifWrapperRef} className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant/60 hover:bg-neutral-canvas hover:scale-105 active:scale-95 transition-all duration-state-change ease-state-change"
              >
                <MaterialIcon name="notifications" size={20} />
                {hasUnreadNotifs && (
                  <span
                    role="status"
                    aria-label="Unread notifications"
                    className="anim-ping-ring absolute top-2 right-2.5 inline-block w-2 h-2 rounded-full bg-light-coral"
                  />
                )}
              </button>

              {notifOpen && (
                <div className="anim-modal-pop absolute right-0 mt-gutter-sm w-72 bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 shadow-xl p-gutter-md z-40 flex flex-col gap-gutter-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-title-md text-light-on-surface">
                      Notifications
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasUnreadNotifs(false)}
                      className="font-body text-label-sm text-light-secondary hover:underline"
                    >
                      Mark read
                    </button>
                  </div>
                  <div className="flex flex-col gap-gutter-xs">
                    <div className="p-gutter-sm rounded-lg bg-light-surface border border-light-outline-variant/30">
                      <p className="font-body text-body-sm text-light-on-surface">
                        Liam requested your review on <span className="font-semibold">Webhook PR</span>.
                      </p>
                      <span className="font-mono text-mono-sm text-light-on-surface-variant">
                        5m ago
                      </span>
                    </div>
                    <div className="p-gutter-sm rounded-lg bg-light-surface border border-light-outline-variant/30">
                      <p className="font-body text-body-sm text-light-on-surface">
                        Daily Design Sync starts at <span className="font-semibold">10:00 AM</span>.
                      </p>
                      <span className="font-mono text-mono-sm text-light-on-surface-variant">
                        18m ago
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="open-new-task-btn"
              type="button"
              onClick={() => setNewTaskModalOpen(true)}
              className="inline-flex items-center justify-center gap-gutter-sm h-10 px-gutter-lg rounded-full bg-light-primary text-light-on-primary hover:bg-light-primary-container hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-state-change ease-state-change"
            >
              <MaterialIcon name="add" size={18} />
              <span className="font-body text-label-lg whitespace-nowrap">New Task</span>
            </button>

            <button
              type="button"
              onClick={onBackToLanding}
              title="Back to TaskFlow Landing Page"
              aria-label="Andra Pratama profile — return to landing page"
              className="inline-flex items-center gap-gutter-sm h-10 p-gutter-xs pr-gutter-md rounded-full bg-neutral-canvas hover:bg-light-surface-variant active:scale-95 transition-all duration-state-change ease-state-change"
            >
              <Avatar
                src={dashboardPeople.andra.avatarUrl}
                alt={dashboardPeople.andra.name}
                className="w-8 h-8"
              />
              <span className="hidden sm:inline font-body text-label-lg text-light-on-surface whitespace-nowrap">
                {dashboardPeople.andra.name}
              </span>
            </button>
          </div>
        </header>

        {/* Left Navigation Rail */}
        <aside className="bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/40 p-gutter-sm flex lg:flex-col items-center justify-between gap-gutter-md min-w-0 overflow-visible">
          <nav
            aria-label="Workspace Navigation"
            className="flex lg:flex-col items-center gap-gutter-xs overflow-x-auto lg:overflow-visible max-w-full w-full lg:w-auto px-1 py-1 lg:p-0"
          >
            {sidebarNavItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSidebarNavClick(item.id, item.targetId)}
                  aria-label={item.label}
                  title={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-all duration-state-change ease-state-change hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-light-primary text-light-on-primary'
                      : 'text-light-on-surface-variant hover:bg-neutral-canvas hover:text-light-on-surface'
                  }`}
                >
                  <MaterialIcon name={item.icon} size={20} filled={isActive} />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(true)}
              aria-label="Quick Add Task"
              title="Quick Add Task"
              className="w-10 h-10 rounded-full shrink-0 bg-neutral-canvas border border-light-outline-variant/50 text-light-on-surface hover:bg-secondary-soft hover:text-light-on-secondary-container hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-state-change ease-state-change"
            >
              <MaterialIcon name="add" size={20} />
            </button>
          </nav>

          <div className="hidden lg:flex flex-col items-center gap-gutter-xs">
            <button
              type="button"
              onClick={onBackToLanding}
              aria-label="Help and Landing Page"
              title="Back to Landing Page"
              className="w-10 h-10 rounded-full text-light-on-surface-variant hover:bg-neutral-canvas hover:text-light-on-surface hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-state-change ease-state-change"
            >
              <MaterialIcon name="help" size={20} />
            </button>
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(true)}
              aria-label="Workspace Settings"
              title="Quick Task Settings"
              className="w-10 h-10 rounded-full text-light-on-surface-variant hover:bg-neutral-canvas hover:text-light-on-surface hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-state-change ease-state-change"
            >
              <MaterialIcon name="settings" size={20} />
            </button>
            <button
              type="button"
              onClick={onBackToLanding}
              aria-label="Back to Landing Page"
              title="Back to Landing Page"
              className="w-10 h-10 rounded-full bg-coral-soft text-light-on-coral-container hover:bg-light-coral-container hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-state-change ease-state-change"
            >
              <MaterialIcon name="logout" size={20} />
            </button>
          </div>
        </aside>

        {/* Main Bento Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md items-stretch min-w-0">
          {/* Left Column: My Tasks + Team Collaboration (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-gutter-md h-full min-w-0">
            {/* My Tasks: Layered Warm Header + Overlapping White Sheet */}
            <section id="dash-tasks" className="flex flex-col">
              <div className="bg-light-tertiary-container rounded-t-xl px-gutter-lg pt-gutter-md pb-gutter-xl flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <MaterialIcon
                    name="wb_sunny"
                    size={18}
                    className="text-light-on-tertiary-container"
                  />
                  <span className="font-body text-label-lg text-light-on-tertiary-container">
                    {activeTimeframeMeta.rangeLabel}
                  </span>
                </div>
                <span
                  id="my-tasks-counter"
                  className="font-body text-label-sm text-light-on-tertiary-container bg-light-surface-container-lowest/70 px-gutter-sm py-gutter-xs rounded-full tabular-nums"
                >
                  {doneCount} / {scopedTasks.length} Done
                </span>
              </div>

              <div className="-mt-4 relative z-10 bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/40 p-gutter-lg flex flex-col gap-gutter-md">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <div>
                    <h2 className="font-headline text-title-lg text-light-on-surface">My Tasks</h2>
                    <p className="font-body text-body-sm text-light-on-surface-variant">
                      {scopedTasks.length} priority items for{' '}
                      {taskDayFilter === 'all' ? activeTimeframeMeta.label.toLowerCase() : taskDayFilter}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Add quick task"
                    id="quick-add-btn"
                    onClick={() => setNewTaskModalOpen(true)}
                    className="w-9 h-9 rounded-full bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-state-change"
                  >
                    <MaterialIcon name="add" size={18} />
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-gutter-sm" role="group" aria-label="Task day filter">
                  {(['today', 'tomorrow'] as const).map((dayKey, idx) => {
                    const isActive = taskDayFilter === dayKey;
                    return (
                      <button
                        key={dayKey}
                        ref={(el) => {
                          dayFilterRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() =>
                          setTaskDayFilter((prev) =>
                            timeframe !== 'today' && prev === dayKey ? 'all' : dayKey,
                          )
                        }
                        onKeyDown={(e) => handleDayFilterKeyDown(e, idx)}
                        aria-pressed={isActive}
                        className={`relative inline-flex items-center justify-center h-8 px-gutter-md rounded-full transition-colors duration-200 motion-reduce:transition-none active:scale-95 ${
                          isActive
                            ? 'text-light-on-primary'
                            : 'bg-neutral-canvas text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-variant/70'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="dashboard-task-day-pill"
                            aria-hidden="true"
                            transition={
                              shouldReduceMotion ? { duration: 0 } : stitchMotion.springSnappy
                            }
                            className="absolute inset-0 rounded-full bg-light-primary shadow-sm pointer-events-none"
                          />
                        )}
                        <span className="relative z-10 font-body text-label-sm leading-none capitalize">
                          {dayKey}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Colorful Pastel Task Cards (fixed 4-card viewport, scrolls when > 4) */}
                <div
                  className="dashboard-scroll h-[408px] overflow-y-auto -mr-1 pr-1 pt-0.5 pb-0.5"
                  id="my-tasks-scroll"
                >
                  <motion.div
                    key={`${timeframe}-${taskDayFilter}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.72, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: stitchMotion.easeSurfaceEnter }
                    }
                    className="flex flex-col gap-gutter-sm"
                    id="my-tasks-list"
                  >
                    {visibleTasks.length === 0 ? (
                      <div className="rounded-xl bg-light-surface border border-light-outline-variant/40 p-gutter-lg text-center">
                        <p className="font-body text-body-sm text-light-on-surface-variant">
                          No tasks match &ldquo;{searchQuery}&rdquo;.
                        </p>
                      </div>
                    ) : (
                      visibleTasks.map((task) => {
                        const tone = TASK_TONE_STYLES[task.tone];
                        const cornerClass =
                          task.cornerVariant === 'a'
                            ? 'rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm'
                            : 'rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm';
                        const timeDisplay =
                          taskDayFilter === 'all'
                            ? `${task.day === 'today' ? 'Today' : 'Tomorrow'} · ${task.time}`
                            : task.time;
                        return (
                          <div
                            key={task.id}
                            className={`bento-card shrink-0 ${tone.cardBg} ${cornerClass} p-gutter-md flex items-center gap-gutter-md transition-opacity duration-200 ${
                              task.done ? 'opacity-80' : ''
                            }`}
                          >
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={task.done}
                              aria-label={`Mark ${task.title} ${task.done ? 'incomplete' : 'complete'}`}
                              onClick={() => handleToggleTask(task.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-110 active:scale-90 ${
                                task.done
                                  ? 'border-light-mint bg-light-mint'
                                  : `${tone.border} bg-light-surface-container-lowest`
                              }`}
                            >
                              {task.done && (
                                <MaterialIcon
                                  name="check"
                                  size={14}
                                  className={`text-light-on-mint ${
                                    recentlyCheckedId === task.id ? 'anim-check-pop' : ''
                                  }`}
                                />
                              )}
                            </button>
                            <div className="flex-1 min-w-0 flex flex-col gap-gutter-xs">
                              <div className="flex items-center justify-between gap-gutter-sm">
                                <span
                                  className={`font-body text-label-sm ${tone.badge} px-gutter-sm py-gutter-xs rounded-full`}
                                >
                                  {task.done ? 'Completed' : task.category}
                                </span>
                                <span
                                  className={`font-mono text-mono-sm ${tone.timeText} tabular-nums whitespace-nowrap`}
                                >
                                  {timeDisplay}
                                </span>
                              </div>
                              <h3
                                className={`font-body text-title-md text-light-on-surface truncate transition-colors duration-200 ${
                                  task.done ? 'line-through' : ''
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p
                                title={task.description}
                                className="font-body text-body-sm text-light-on-surface-variant truncate"
                              >
                                {task.description}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Team Collaboration: Folder-Tab Header + Recessed Avatar Notch */}
            <section id="dash-team" className="flex flex-col flex-1">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-sm">
                  <MaterialIcon name="group" size={18} className="text-light-on-surface" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Team Collaboration
                  </h2>
                </div>
                <div className="flex items-center gap-gutter-xs pb-gutter-xs pr-gutter-xs">
                  <Avatar
                    src={dashboardPeople.liam.avatarUrl}
                    alt={dashboardPeople.liam.firstName}
                    className="hidden sm:inline-flex w-7 h-7 border-2 border-light-surface-container-lowest transition-transform duration-150 hover:scale-110"
                  />
                  <Avatar
                    src={dashboardPeople.elena.avatarUrl}
                    alt={dashboardPeople.elena.firstName}
                    className="hidden sm:inline-flex w-7 h-7 border-2 border-light-surface-container-lowest transition-transform duration-150 hover:scale-110"
                  />
                  <Avatar
                    src={dashboardPeople.noah.avatarUrl}
                    alt={dashboardPeople.noah.firstName}
                    className="hidden sm:inline-flex w-7 h-7 border-2 border-light-surface-container-lowest transition-transform duration-150 hover:scale-110"
                  />
                  <span className="font-body text-label-sm text-light-on-mint-container bg-mint-soft px-gutter-sm py-gutter-xs rounded-full whitespace-nowrap">
                    4 Online
                  </span>
                </div>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg flex flex-col justify-start gap-gutter-sm flex-1">
                {dashboardTeamMembers.map((member) => (
                  <div
                    key={member.person.name}
                    className="group flex items-center justify-between gap-gutter-sm px-gutter-sm py-gutter-xs rounded-full bg-light-surface border border-light-outline-variant/30 transition-all duration-200 hover:translate-x-1 hover:bg-neutral-canvas/80 hover:border-light-secondary/30"
                  >
                    <div className="flex items-center gap-gutter-sm min-w-0">
                      <Avatar
                        src={member.person.avatarUrl}
                        alt={member.person.name}
                        className="w-8 h-8 transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-body text-title-md text-light-on-surface truncate">
                          {member.person.name}
                        </span>
                        <span className="font-body text-body-sm text-light-on-surface-variant truncate">
                          {member.task}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-body text-label-sm ${member.statusClass} px-gutter-sm py-gutter-xs rounded-full shrink-0`}
                    >
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Center Column: Progress Snapshot + Sprint Board + Weekly Velocity (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-gutter-md h-full min-w-0">
            {/* Progress Snapshot */}
            <section id="dash-progress" className="flex flex-col">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-sm">
                  <MaterialIcon name="analytics" size={18} className="text-light-secondary" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Progress Snapshot
                  </h2>
                </div>
                <span className="font-body text-label-sm text-light-on-surface-variant bg-light-surface-container-lowest/80 px-gutter-md py-gutter-xs rounded-full mb-gutter-xs mr-gutter-xs whitespace-nowrap">
                  {activeTimeframeMeta.shortBadge}
                </span>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg min-h-[252px] flex flex-col justify-between">
                <motion.div
                  key={timeframe}
                  initial={shouldReduceMotion ? false : { opacity: 0.65, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.2, ease: stitchMotion.easeSurfaceEnter }
                  }
                  className="flex flex-col gap-gutter-md flex-1 justify-between"
                >
                  {activeProgressSnapshot ? (
                    <>
                      {/* Weekly Day Strip */}
                      <div className="grid grid-cols-7 gap-gutter-xs text-center">
                        {WEEKDAY_LABELS.map((day, idx) => {
                          const isCompleted =
                            activeProgressSnapshot.completedWeekdayIndices.includes(idx);
                          const isCurrent = activeProgressSnapshot.activeWeekdayIndex === idx;
                          return (
                            <div key={day} className="flex flex-col items-center gap-gutter-xs group">
                              <span
                                className={`h-5 inline-flex items-center justify-center leading-none px-gutter-sm font-body text-label-sm ${
                                  isCurrent
                                    ? 'rounded-full bg-light-primary text-light-on-primary'
                                    : 'text-light-on-surface-variant'
                                }`}
                              >
                                {day}
                              </span>
                              {isCompleted ? (
                                <span className="w-7 h-7 rounded-full bg-mint-soft text-light-mint flex items-center justify-center transition-transform duration-150 group-hover:scale-110">
                                  <MaterialIcon name="check" size={16} />
                                </span>
                              ) : isCurrent ? (
                                <span className="w-7 h-7 rounded-full border-2 border-light-secondary bg-secondary-soft text-light-secondary flex items-center justify-center transition-transform duration-150 group-hover:scale-110">
                                  <MaterialIcon name="autorenew" size={14} className="anim-spin-slow" />
                                </span>
                              ) : (
                                <span className="w-7 h-7 rounded-full border border-light-outline-variant transition-transform duration-150 group-hover:scale-110 group-hover:border-light-secondary/50" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Big Metric + Multi-Segment Bar */}
                      <div className="bg-light-surface rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm p-gutter-md flex flex-col gap-gutter-sm">
                        <div className="flex items-center justify-between gap-gutter-md">
                          <div className="flex items-center gap-gutter-md">
                            <span
                              id="progress-percent"
                              className="font-headline text-display-lg text-light-on-surface tabular-nums"
                            >
                              {activeProgressSnapshot.percent}%
                            </span>
                            <span className="font-body text-body-md text-light-on-surface-variant">
                              {activeProgressSnapshot.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-gutter-xs h-3 w-full rounded-full overflow-hidden bg-neutral-canvas">
                          {activeProgressSnapshot.segments.map((seg, i) => (
                            <div
                              key={`${seg.colorClass}-${i}`}
                              className={`h-full ${seg.colorClass} rounded-full transition-all duration-300 hover:brightness-95`}
                              style={{ width: `${seg.widthPercent}%` }}
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-gutter-md pt-gutter-xs">
                          {activeProgressSnapshot.stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                              <span className="font-headline text-title-lg text-light-on-surface tabular-nums">
                                {stat.value}
                              </span>
                              <span className="font-body text-body-sm text-light-on-surface-variant">
                                {stat.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      id="progress-empty-state"
                      className="flex-1 bg-light-surface rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border border-dashed border-light-outline-variant/60 p-gutter-lg flex flex-col items-center justify-center text-center gap-gutter-sm"
                    >
                      <span className="w-10 h-10 rounded-full bg-secondary-soft text-light-secondary flex items-center justify-center">
                        <MaterialIcon name="calendar_month" size={20} />
                      </span>
                      <div className="flex flex-col gap-gutter-xs max-w-xs">
                        <h3 className="font-headline text-title-md text-light-on-surface">
                          No monthly progress summary yet
                        </h3>
                        <p className="font-body text-body-sm text-light-on-surface-variant">
                          Monthly sprint completion totals are not available for{' '}
                          {activeTimeframeMeta.rangeLabel} yet.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectTimeframe('week')}
                        className="mt-gutter-xs inline-flex items-center gap-gutter-xs h-8 px-gutter-md rounded-full bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors active:scale-95"
                      >
                        <span className="font-body text-label-sm">View This Week</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Active Sprint */}
            <section id="dash-sprint" className="flex flex-col">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-sm">
                  <MaterialIcon name="view_kanban" size={18} className="text-light-secondary" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Active Sprint
                  </h2>
                </div>
                <div className="flex items-center gap-gutter-sm pb-gutter-xs pr-gutter-xs">
                  <span className="font-body text-label-sm text-light-on-surface-variant bg-light-surface-container-lowest/80 px-gutter-sm py-gutter-xs rounded-full whitespace-nowrap">
                    {activeTimeframeMeta.label}
                  </span>
                  <div className="hidden sm:flex -space-x-2">
                    {[dashboardPeople.sophia, dashboardPeople.liam, dashboardPeople.elena].map(
                      (person) => (
                        <Avatar
                          key={person.name}
                          src={person.avatarUrl}
                          alt={person.firstName}
                          className="w-7 h-7 border-2 border-light-surface-container-lowest transition-transform duration-150 hover:-translate-y-0.5 hover:scale-110 hover:z-10"
                        />
                      ),
                    )}
                    <span className="w-7 h-7 rounded-full bg-secondary-soft text-light-on-secondary-container border-2 border-light-surface-container-lowest flex items-center justify-center font-body text-label-sm tabular-nums">
                      +4
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg flex flex-col gap-gutter-md">
                <div
                  role="tablist"
                  aria-label="Sprint task status"
                  className="flex flex-wrap items-center gap-gutter-xs"
                >
                  {SPRINT_TABS.map((tabId, idx) => {
                    const isSelected = activeSprintTab === tabId;
                    const tabData = sprintTabPanels[tabId];
                    const tabCount = sprintCardsByTabForPeriod[tabId].length;
                    return (
                      <button
                        key={tabId}
                        ref={(el) => {
                          sprintTabRefs.current[idx] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`tab-${tabId}`}
                        aria-selected={isSelected}
                        aria-controls={`panel-${tabId}`}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setActiveSprintTab(tabId)}
                        onKeyDown={(e) => handleSprintTabKeyDown(e, idx)}
                        className={`inline-flex items-center gap-gutter-xs px-gutter-md py-gutter-xs rounded-full transition-all duration-state-change active:scale-95 ${
                          isSelected
                            ? 'bg-light-primary text-light-on-primary'
                            : 'bg-light-surface text-light-on-surface-variant hover:text-light-on-surface hover:bg-neutral-canvas'
                        }`}
                      >
                        <span className="font-body text-label-sm">{tabData.label}</span>
                        <span
                          className={`font-body text-label-sm tabular-nums ${
                            tabId === 'todo' && isSelected
                              ? 'bg-coral-soft text-light-on-coral-container w-4 h-4 inline-flex items-center justify-center leading-none rounded-full'
                              : ''
                          }`}
                        >
                          {tabCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <motion.div
                  key={`${timeframe}-${activeSprintTab}`}
                  initial={shouldReduceMotion ? false : { opacity: 0.72, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.2, ease: stitchMotion.easeSurfaceEnter }
                  }
                  role="tabpanel"
                  id={`panel-${activeSprintTab}`}
                  aria-labelledby={`tab-${activeSprintTab}`}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch min-h-[172px]"
                >
                  {activeSprintCards.length === 0 ? (
                    <div className="sm:col-span-2 rounded-xl bg-light-surface border border-dashed border-light-outline-variant/60 p-gutter-lg flex flex-col items-center justify-center text-center gap-gutter-sm">
                      <p className="font-body text-body-sm text-light-on-surface-variant">
                        {normalizedQuery
                          ? `No sprint cards match "${searchQuery}".`
                          : `No ${sprintTabPanels[activeSprintTab].label} cards scheduled for ${activeTimeframeMeta.label.toLowerCase()}.`}
                      </p>
                      {!normalizedQuery && timeframe === 'today' && (
                        <div className="flex flex-wrap items-center justify-center gap-gutter-xs">
                          {activeSprintTab !== 'review' &&
                            sprintCardsByTabForPeriod.review.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setActiveSprintTab('review')}
                                className="h-8 px-gutter-md rounded-full bg-secondary-soft text-light-on-secondary-container font-body text-label-sm hover:opacity-90 active:scale-95 transition-all"
                              >
                                See {sprintCardsByTabForPeriod.review.length} due today in Review
                              </button>
                            )}
                          <button
                            type="button"
                            onClick={() => handleSelectTimeframe('week')}
                            className="h-8 px-gutter-md rounded-full bg-light-primary text-light-on-primary font-body text-label-sm hover:bg-light-primary-container active:scale-95 transition-all"
                          >
                            View This Week
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    activeSprintCards.map((card) => {
                      const cornerClass =
                        card.cornerVariant === 'a'
                          ? 'rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm'
                          : 'rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm';
                      return (
                        <article
                          key={card.id}
                          className={`bento-card bg-light-surface ${cornerClass} border border-light-outline-variant/40 hover:border-light-secondary/40 p-gutter-md flex flex-col justify-between gap-gutter-md h-full`}
                        >
                          <div className="flex flex-col gap-gutter-sm">
                            <div className="flex items-center justify-between gap-gutter-xs">
                              <span
                                className={`font-body text-label-sm px-gutter-sm py-gutter-xs rounded-full ${card.badgeClass}`}
                              >
                                {card.badge}
                              </span>
                              <span className="font-body text-label-sm text-light-on-surface-variant">
                                {card.due}
                              </span>
                            </div>
                            <h3 className="font-headline text-title-lg text-light-on-surface">
                              {card.title}
                            </h3>
                            <p className="font-body text-body-sm text-light-on-surface-variant">
                              {card.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-gutter-sm border-t border-light-outline-variant/30">
                            <div className="flex -space-x-2">
                              {card.assignees.map((person) => (
                                <Avatar
                                  key={person.name}
                                  src={person.avatarUrl}
                                  alt={person.firstName}
                                  className="w-6 h-6 border border-light-surface-container-lowest"
                                />
                              ))}
                            </div>
                            <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                              {card.progress}
                            </span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </motion.div>
              </div>
            </section>

            {/* Weekly Velocity / Team Output Card */}
            <section id="dash-velocity" className="flex flex-col flex-1">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-sm">
                  <MaterialIcon name="bar_chart" size={18} className="text-light-secondary" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Team Velocity
                  </h2>
                </div>
                <span
                  id="velocity-period-badge"
                  className="inline-flex items-center gap-gutter-xs bg-light-surface-container-lowest/80 text-light-on-surface-variant px-gutter-md py-gutter-xs rounded-full mb-gutter-xs mr-gutter-xs whitespace-nowrap"
                >
                  <span className="font-body text-label-sm leading-none">
                    {velocityDataset.badgeLabel}
                  </span>
                </span>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg flex flex-col justify-between gap-gutter-sm flex-1">
                <p
                  id="velocity-subtitle"
                  className="font-body text-body-sm text-light-on-surface-variant"
                >
                  {velocityDataset.subtitle}
                </p>

                {/* Hatched Pill Bar Chart */}
                <div className="relative flex items-end gap-gutter-md pt-14">
                  {/* Y-Axis Labels */}
                  <div className="flex flex-col justify-between h-32 pb-6 text-right pr-gutter-xs shrink-0 min-w-[30px]">
                    {velocityDataset.yAxisLabels.map((val) => (
                      <span
                        key={val}
                        className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums"
                      >
                        {val}
                      </span>
                    ))}
                  </div>

                  {/* 7-Day Hatched Pill Columns */}
                  <div
                    className="relative flex-1 grid grid-cols-7 gap-gutter-xs sm:gap-gutter-sm items-end h-32"
                    id="velocity-chart"
                    onMouseLeave={() => setActiveVelocityIndex(velocityDataset.defaultActiveIndex)}
                  >
                    {/* Floating Dark Tooltip */}
                    {activeBar && (
                      <div
                        id="velocity-tooltip"
                        aria-live="polite"
                        className="absolute -top-14 z-10 bg-light-primary text-light-on-primary rounded-lg px-gutter-md py-gutter-xs shadow-md pointer-events-none transition-all duration-200 ease-out"
                        style={{ left: `${clampedTooltipLeft}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="flex items-center justify-between gap-gutter-md whitespace-nowrap">
                          <span className="inline-flex items-center gap-gutter-xs font-body text-label-sm">
                            <span className="w-2 h-2 rounded-full bg-dark-secondary" />
                            Completed
                          </span>
                          <span
                            id="velocity-tooltip-completed"
                            className="font-mono text-mono-sm tabular-nums"
                          >
                            {activeBar.completedLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-gutter-md whitespace-nowrap">
                          <span className="inline-flex items-center gap-gutter-xs font-body text-label-sm opacity-90">
                            <span
                              className="w-2 h-2 rounded-xs"
                              style={{
                                background:
                                  'repeating-linear-gradient(-45deg, #C9BEFF, #C9BEFF 1.5px, transparent 1.5px, transparent 3.5px)',
                              }}
                            />
                            Target
                          </span>
                          <span
                            id="velocity-tooltip-target"
                            className="font-mono text-mono-sm tabular-nums opacity-90"
                          >
                            {activeBar.targetLabel}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-light-primary rotate-45 mx-auto -mb-2 mt-0.5" />
                      </div>
                    )}

                    {velocityDataset.bars.map((bar, idx) => {
                      const isActive = activeVelocityIndex === idx;
                      return (
                        <button
                          key={bar.day}
                          type="button"
                          onPointerEnter={(e) => handleVelocityPointerEnter(e, idx)}
                          onFocus={() => setActiveVelocityIndex(idx)}
                          onClick={() => setActiveVelocityIndex(idx)}
                          aria-label={`${bar.day}: ${bar.completedLabel} completed of ${bar.targetLabel} target`}
                          aria-pressed={isActive}
                          className="group cursor-pointer flex flex-col items-center gap-gutter-xs h-full justify-end transition-transform duration-200 hover:-translate-y-1 focus:outline-none"
                        >
                          <div
                            className={`w-full max-w-[34px] rounded-lg overflow-hidden flex flex-col justify-end transition-[height,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
                              isActive
                                ? 'ring-2 ring-light-secondary/30 ring-offset-2 ring-offset-light-surface-container-lowest'
                                : 'group-hover:ring-2 group-hover:ring-light-secondary/30 group-hover:ring-offset-2 group-hover:ring-offset-light-surface-container-lowest'
                            }`}
                            style={{
                              height: `${bar.targetPercent}%`,
                              background: isActive
                                ? 'repeating-linear-gradient(-45deg, #C9BEFF, #C9BEFF 2px, #F4EEFF 2px, #F4EEFF 6px)'
                                : 'repeating-linear-gradient(-45deg, #D8D4EB, #D8D4EB 2px, #F8F9FF 2px, #F8F9FF 6px)',
                            }}
                          >
                            <div
                              className={`w-full rounded-lg shrink-0 transition-[height,background-color] duration-300 ease-out motion-reduce:transition-none ${
                                isActive
                                  ? 'bg-light-secondary'
                                  : 'bg-light-secondary-container group-hover:bg-light-secondary'
                              }`}
                              style={{ height: `${bar.completedPercent}%` }}
                            />
                          </div>
                          <span
                            className={`font-body text-label-sm leading-none py-0.5 px-1.5 sm:px-gutter-sm rounded-full transition-colors duration-200 ${
                              isActive
                                ? 'bg-light-primary text-light-on-primary'
                                : 'text-light-on-surface-variant group-hover:bg-light-primary group-hover:text-light-on-primary'
                            }`}
                          >
                            {bar.day}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Calendar + Meetings + Timer & Notes + Team Chat (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-gutter-md h-full min-w-0">
            {/* Mini Calendar Card */}
            <section
              id="dash-calendar"
              className="bg-light-surface-container-lowest rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md border border-light-outline-variant/40 p-gutter-lg flex flex-col gap-gutter-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-title-lg text-light-on-surface">
                  {CALENDAR_MONTHS[calendarMonthIdx]}
                </h2>
                <div className="flex items-center gap-gutter-xs">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setCalendarMonthIdx((prev) =>
                        prev > 0 ? prev - 1 : CALENDAR_MONTHS.length - 1,
                      )
                    }
                    className="w-7 h-7 rounded-full hover:bg-neutral-canvas active:scale-90 flex items-center justify-center text-light-on-surface-variant transition-all duration-150"
                  >
                    <MaterialIcon name="chevron_left" size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setCalendarMonthIdx((prev) => (prev + 1) % CALENDAR_MONTHS.length)
                    }
                    className="w-7 h-7 rounded-full hover:bg-neutral-canvas active:scale-90 flex items-center justify-center text-light-on-surface-variant transition-all duration-150"
                  >
                    <MaterialIcon name="chevron_right" size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-gutter-xs text-center">
                {(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const).map((dayLabel) => (
                  <span
                    key={dayLabel}
                    className="font-body text-label-sm text-light-on-surface-variant h-6 flex items-center justify-center"
                  >
                    {dayLabel}
                  </span>
                ))}

                {dashboardCalendarDays.map((item) => {
                  const isSelected = selectedCalendarDay === item.day;
                  const toneClass = isSelected
                    ? 'text-light-on-primary bg-light-primary shadow-sm'
                    : item.tone && item.tone !== 'primary'
                      ? CALENDAR_DAY_TONES[item.tone]
                      : 'text-light-on-surface hover:bg-neutral-canvas';

                  return (
                    <button
                      key={item.day}
                      type="button"
                      onClick={() => setSelectedCalendarDay(item.day)}
                      aria-pressed={isSelected}
                      aria-label={`${CALENDAR_MONTHS[calendarMonthIdx]} ${item.day}`}
                      className={`rounded-full transition-transform duration-150 hover:scale-110 font-body text-body-sm leading-none w-7 h-7 mx-auto flex items-center justify-center tabular-nums ${toneClass}`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Upcoming Meetings */}
            <section className="flex flex-col">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-xs">
                  <MaterialIcon name="videocam" size={16} className="text-light-mint" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Meet Schedule
                  </h2>
                </div>
                <span className="font-body text-label-sm text-light-on-mint-container bg-mint-soft px-gutter-sm py-gutter-xs rounded-full mb-gutter-xs mr-gutter-xs whitespace-nowrap">
                  {dashboardMeetings.length} {activeTimeframeMeta.label}
                </span>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg flex flex-col gap-gutter-sm">
                {dashboardMeetings.map((meeting) => {
                  const isActive = Boolean(joinedMeetingIds[meeting.id]);
                  return (
                    <div
                      key={meeting.id}
                      className="p-gutter-sm rounded-full bg-light-surface border border-light-outline-variant/40 flex items-center justify-between gap-gutter-sm pl-gutter-md transition-all duration-200 hover:bg-neutral-canvas/70 hover:border-light-secondary/30"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-body text-title-md text-light-on-surface truncate">
                          {meeting.title}
                        </span>
                        <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums truncate">
                          {meeting.meta}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() =>
                          setJoinedMeetingIds((prev) => ({
                            ...prev,
                            [meeting.id]: !prev[meeting.id],
                          }))
                        }
                        className={`inline-flex items-center justify-center h-8 px-gutter-md rounded-full shrink-0 transition-all duration-150 hover:scale-105 active:scale-95 ${
                          isActive
                            ? 'bg-mint-soft text-light-on-mint-container'
                            : meeting.primary
                              ? 'bg-light-primary text-light-on-primary hover:bg-light-primary-container'
                              : 'bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant'
                        }`}
                      >
                        <span className="font-body text-label-sm leading-none">
                          {isActive ? meeting.activeLabel : meeting.ctaLabel}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Focus Timer & Quick Notes Split */}
            <div className="grid grid-cols-2 gap-gutter-sm items-stretch">
              <section className="bento-card bg-light-secondary-container rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm p-gutter-md flex flex-col justify-between gap-gutter-sm h-full">
                <div className="flex items-center justify-between">
                  <span className="font-body text-label-lg text-light-on-secondary-container">
                    Focus
                  </span>
                  <MaterialIcon name="timer" size={18} className="text-light-secondary" />
                </div>
                <div className="flex items-end justify-between gap-gutter-xs">
                  <span
                    id="timer-display"
                    className="font-headline text-headline-md text-light-on-secondary-container tabular-nums"
                  >
                    {timerMinutes}:{timerSeconds}
                  </span>
                  <button
                    id="timer-toggle-btn"
                    type="button"
                    onClick={handleToggleTimer}
                    aria-label={timerRunning ? 'Pause focus timer' : 'Start focus timer'}
                    className={`relative w-8 h-8 pl-[1px] rounded-full bg-light-secondary text-light-on-secondary flex items-center justify-center shrink-0 hover:scale-110 active:scale-90 transition-all duration-150 ${
                      timerRunning ? 'anim-ping-ring' : ''
                    }`}
                  >
                    <MaterialIcon
                      name={timerRunning ? 'pause' : 'play_arrow'}
                      size={16}
                      filled
                    />
                  </button>
                </div>
              </section>

              <section className="bento-card bg-coral-soft rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm p-gutter-md flex flex-col justify-between gap-gutter-sm h-full">
                <div className="flex items-center justify-between">
                  <span className="font-body text-label-lg text-light-on-coral-container">
                    Notes
                  </span>
                  <MaterialIcon name="edit_note" size={18} className="text-light-coral" />
                </div>
                <p className="font-body text-body-sm text-light-on-coral-container">
                  Finalize Q4 tokens before Friday review.
                </p>
              </section>
            </div>

            {/* Team Chat */}
            <section id="dash-chat" className="flex flex-col flex-1">
              <div className="flex items-end justify-between gap-gutter-sm">
                <div className="folder-tab-curve bg-light-surface-container-lowest rounded-tl-xl rounded-tr-xl px-gutter-lg py-gutter-sm flex items-center gap-gutter-xs">
                  <MaterialIcon name="chat_bubble" size={16} className="text-light-secondary" />
                  <h2 className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
                    Team Chat
                  </h2>
                </div>
                <span className="font-body text-label-sm text-light-on-secondary-container bg-secondary-soft px-gutter-sm py-gutter-xs rounded-full mb-gutter-xs mr-gutter-xs whitespace-nowrap">
                  2 New
                </span>
              </div>

              <div className="bg-light-surface-container-lowest rounded-b-xl rounded-tr-xl p-gutter-lg flex flex-col justify-between gap-gutter-sm flex-1">
                <div className="flex flex-col gap-gutter-sm max-h-[300px] overflow-y-auto pr-0.5" id="chat-messages">
                  {chatMessages.map((msg) => {
                    if (msg.outgoing) {
                      return (
                        <div
                          key={msg.id}
                          className="anim-fade-up p-gutter-sm rounded-tl-xl rounded-bl-xl rounded-br-sm rounded-tr-xl bg-light-secondary text-light-on-secondary flex items-start justify-end gap-gutter-sm ml-gutter-lg transition-transform duration-200 hover:-translate-x-0.5"
                        >
                          <div className="flex flex-col items-end min-w-0">
                            <div className="flex items-center gap-gutter-xs">
                              <span className="font-body text-label-sm text-light-on-secondary/80 tabular-nums">
                                {msg.time}
                              </span>
                              <span className="font-body text-label-sm text-light-on-secondary">
                                {msg.sender.firstName}
                              </span>
                            </div>
                            <p className="font-body text-body-sm text-light-on-secondary text-right break-words">
                              {msg.text}
                            </p>
                          </div>
                          <Avatar
                            src={msg.sender.avatarUrl}
                            alt={msg.sender.name}
                            className="w-7 h-7 border border-light-on-secondary/30"
                          />
                        </div>
                      );
                    }

                    const tone = CHAT_BUBBLE_STYLES[msg.bubbleTone ?? 'sky'];
                    return (
                      <div
                        key={msg.id}
                        className={`p-gutter-sm rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-sm ${tone.bg} flex items-start gap-gutter-sm transition-transform duration-200 hover:translate-x-0.5`}
                      >
                        <Avatar
                          src={msg.sender.avatarUrl}
                          alt={msg.sender.firstName}
                          className="w-7 h-7"
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-gutter-xs">
                            <span className={`font-body text-label-sm ${tone.name}`}>
                              {msg.sender.firstName}
                            </span>
                            <span className={`font-body text-label-sm ${tone.time} tabular-nums`}>
                              {msg.time}
                            </span>
                          </div>
                          <p className={`font-body text-body-sm ${tone.text} break-words`}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Composer */}
                <form
                  id="chat-form"
                  onSubmit={handleChatSubmit}
                  className="flex items-center gap-gutter-xs bg-neutral-canvas rounded-full px-gutter-md py-gutter-xs transition-all duration-150 focus-within:ring-2 focus-within:ring-light-secondary/30"
                >
                  <button
                    type="button"
                    aria-label="Attach file"
                    className="text-light-on-surface-variant hover:text-light-on-surface hover:scale-110 active:scale-90 transition-all duration-150 flex items-center justify-center shrink-0"
                  >
                    <MaterialIcon name="attach_file" size={16} />
                  </button>
                  <input
                    id="chat-input"
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message #sprint-q4..."
                    aria-label="Reply to team chat"
                    className="bg-transparent border-none p-0 focus:ring-0 font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant w-full"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="w-7 h-7 rounded-full bg-light-primary text-light-on-primary hover:bg-light-primary-container hover:scale-105 active:scale-90 transition-all duration-150 flex items-center justify-center shrink-0"
                  >
                    <MaterialIcon name="send" size={14} />
                  </button>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Lightweight New Task Modal */}
      {newTaskModalOpen && (
        <div
          id="new-task-modal"
          className="fixed inset-0 z-50 bg-light-primary/40 backdrop-blur-[2px] flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setNewTaskModalOpen(false);
              setNewTaskTitle('');
            }
          }}
        >
          <div className="anim-modal-pop bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-xl w-full max-w-md flex flex-col gap-gutter-lg shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="modal-title" className="font-headline text-headline-md text-light-on-surface">
                Create New Task
              </h2>
              <button
                id="close-modal-btn"
                type="button"
                aria-label="Close modal"
                onClick={() => {
                  setNewTaskModalOpen(false);
                  setNewTaskTitle('');
                }}
                className="w-8 h-8 rounded-full hover:bg-neutral-canvas active:scale-90 transition-all duration-150 flex items-center justify-center text-light-on-surface-variant"
              >
                <MaterialIcon name="close" size={18} />
              </button>
            </div>
            <form id="new-task-form" onSubmit={handleCreateTaskSubmit} className="flex flex-col gap-gutter-md">
              <div className="flex flex-col gap-gutter-xs">
                <label
                  htmlFor="task-name-input"
                  className="font-body text-label-lg text-light-on-surface"
                >
                  Task Title
                </label>
                <input
                  ref={taskInputRef}
                  id="task-name-input"
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Review sprint backlog"
                  className="rounded-md border border-light-outline-variant bg-light-surface px-gutter-md py-gutter-sm font-body text-body-md text-light-on-surface focus:ring-2 focus:ring-light-secondary focus:border-light-secondary"
                />
              </div>
              <div className="flex items-center justify-end gap-gutter-sm pt-gutter-sm">
                <button
                  type="button"
                  id="cancel-modal-btn"
                  onClick={() => {
                    setNewTaskModalOpen(false);
                    setNewTaskTitle('');
                  }}
                  className="px-gutter-lg py-gutter-sm rounded-full bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant active:scale-95 transition-all duration-150"
                >
                  <span className="font-body text-label-lg">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-gutter-lg py-gutter-sm rounded-full bg-light-primary text-light-on-primary hover:bg-light-primary-container active:scale-95 transition-all duration-150"
                >
                  <span className="font-body text-label-lg">Add Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
