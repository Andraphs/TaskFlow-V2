import { velocityTimeframes } from './mockData';

export type DashboardTimeframe = 'today' | 'week' | 'month';

export interface DashboardTimeframeMeta {
  id: DashboardTimeframe;
  label: string;
  rangeLabel: string;
  shortBadge: string;
}

export const dashboardTimeframes: DashboardTimeframeMeta[] = [
  {
    id: 'today',
    label: 'Today',
    rangeLabel: 'Sun, 22 Nov 2026',
    shortBadge: 'Today · Nov 22',
  },
  {
    id: 'week',
    label: 'This Week',
    rangeLabel: 'Nov 16 – 22, 2026',
    shortBadge: 'Nov 16 – 22',
  },
  {
    id: 'month',
    label: 'This Month',
    rangeLabel: 'November 2026',
    shortBadge: 'Nov 2026',
  },
];

export interface DashboardPerson {
  name: string;
  firstName: string;
  avatarUrl: string;
}

export interface DashboardTaskItem {
  id: string;
  day: 'today' | 'tomorrow';
  category: string;
  time: string;
  title: string;
  description: string;
  done: boolean;
  tone: 'tertiary' | 'sky' | 'secondary' | 'mint';
  cornerVariant: 'a' | 'b';
}

export interface DashboardTeamMember {
  person: DashboardPerson;
  task: string;
  status: string;
  statusClass: string;
}

export type SprintTabId = 'todo' | 'progress' | 'review';

export interface SprintCardItem {
  id: string;
  badge: string;
  badgeClass: string;
  due: string;
  periods: DashboardTimeframe[];
  title: string;
  description: string;
  assignees: DashboardPerson[];
  progress: string;
  cornerVariant: 'a' | 'b';
}

export interface VelocityBarItem {
  day: string;
  targetPercent: number;
  completedPercent: number;
  completedLabel: string;
  targetLabel: string;
  posPercent: number;
  isDefaultActive?: boolean;
}

export interface VelocityPeriodDataset {
  badgeLabel: string;
  subtitle: string;
  yAxisLabels: [string, string, string, string];
  defaultActiveIndex: number;
  bars: VelocityBarItem[];
}

export interface ProgressSnapshotData {
  percent: number;
  label: string;
  segments: { colorClass: string; widthPercent: number }[];
  stats: { value: number; label: string }[];
  activeWeekdayIndex: number;
  completedWeekdayIndices: number[];
}

export interface CalendarDayItem {
  day: number;
  tone?: 'tertiary' | 'secondary' | 'primary' | 'coral' | 'mint';
}

export interface MeetingItem {
  id: string;
  title: string;
  meta: string;
  ctaLabel: string;
  activeLabel: string;
  primary: boolean;
}

export interface ChatMessageItem {
  id: string;
  sender: DashboardPerson;
  time: string;
  text: string;
  outgoing?: boolean;
  bubbleTone?: 'sky' | 'secondary' | 'mint';
}

export const dashboardPeople = {
  andra: {
    name: 'Andra Pratama',
    firstName: 'Andra Pratama',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDyTdwPjzs_zgaMUfewCZqWTD2z_WdnD_wc5wlKq3D1XQGh3LgFQ60vMOZKYACcVm72qvLW6iH1BdjeCVyxEEaWeL5itGcRm4wPvwEKS863FYriX5EBGwMBc85v3cTqivdvGK7V0pnUImP_ZZAj8p2obaSup2TcvlrloOhewY4fUrXBD9kEoqm0m83ank0eGZ5KxnVFipQpd90kZpb6kjolBtYI1PuzCaDxqF5kz6NMTNln-dl0mGAyXzsFYQ',
  },
  liam: {
    name: 'Liam Carter',
    firstName: 'Liam',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDjLdRA5nNCBMeLxgyYINx9zRilNP647QTh-g8QwG8MAOBzq0dLY_Cwt34k0yBNYONvq1rg6LYamhWKqB7Kv8DNKPfDMg8j-OwVXCFB0hNKiD0nHj-gONiyeBDg6d_OrXB-w65S8GcmO_FBRd-ipEQQrS1IK3NPub6Qob4LWCXwUegpiRKhYP543VbPAE3LUh5mwPN6Hf2ZrQN0Wkw43Vf8s-HwVLMjTYnee2BSU-9aMZML7Teh6w',
  },
  elena: {
    name: 'Elena Vance',
    firstName: 'Elena',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCO7rLyIIk340u5OkDEfuoTC5TODzjKVoncTNe1y_NDKtKhc2vdZBc7yfKPU2QPzaU2rKs6ayhotaD_MnJqLQhs2ZR3Xkrj8qEGxn2YyvuIfyyeP41nEXGj8KGgXfT8D_EUfAiOReeiSCJCB8-MdUlhKEM6pdkTEBf9hnyFa_zkdpjldvWHI2ItYnGi5K0RYmuT0uZ2PXJIel63_GsvLzbycFHs7FwKZvFYGMOjN7kq8ydZYr1dlA',
  },
  noah: {
    name: 'Noah Bennett',
    firstName: 'Noah',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCtTmKcmHu6tG1R4XOeVCDBNwQUo921TVI5MJN5rVizsgwgoporgwXqSDbU3aUKBOU6AxL4dSLgHB4gJcfL6u4ba42yuaJj_HSZpEQJxTHxFWCpfrkiVL8tehFI2YDeiQIFiMzHVsdGGjSs5waKGiH_6EFPpk68uFFFzMeIZa-sxBfuR5_F_k9k3acpvMtETiHzaDFbbwSPNUP0Q634PkMlljvT_SAhCmRIjUjBudF1vxUF5TGUdw',
  },
  sophia: {
    name: 'Sophia Miller',
    firstName: 'Sophia',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDRIcYOEYMkvt6Na_7EW429KhH2R5DnNTQhxBYg4LdlMIoszwmevkA1LtxD-0ZRZt7T0nicq6nHPXsmpS5trQh4Triin75MrO9HivfvZGF-5-jfrbFdJ0K6x4o8AfP55kf6jPfm8TocrXPH4a7Bsg0gn8MkBG3DgiI3fF-LTEdIr-OLhw-3-wqIr2Ze0J-hZM9eLuUTMccIhTBEthizOj95liZeXjSuBJPuBNOGca2KNHIs5u1i3g',
  },
} satisfies Record<string, DashboardPerson>;

export const initialDashboardTasks: DashboardTaskItem[] = [
  {
    id: 'task-1',
    day: 'today',
    category: 'Design',
    time: '10:30 AM',
    title: 'Design System Token Audit',
    description: 'Align button & badge spacing across web views.',
    done: false,
    tone: 'tertiary',
    cornerVariant: 'a',
  },
  {
    id: 'task-2',
    day: 'today',
    category: 'Engineering',
    time: '01:15 PM',
    title: 'Sync Task Webhook Endpoints',
    description: 'Collaborate with backend team on live updates.',
    done: false,
    tone: 'sky',
    cornerVariant: 'b',
  },
  {
    id: 'task-3',
    day: 'today',
    category: 'Research',
    time: '03:45 PM',
    title: 'Usability Test — Onboarding Flow',
    description: 'Prepare 5 user scenarios for afternoon session.',
    done: false,
    tone: 'secondary',
    cornerVariant: 'a',
  },
  {
    id: 'task-4',
    day: 'today',
    category: 'Completed',
    time: '09:00 AM',
    title: 'Publish Q4 Sprint Roadmap',
    description: 'Shared final timeline with product stakeholders.',
    done: true,
    tone: 'mint',
    cornerVariant: 'b',
  },
  {
    id: 'task-5',
    day: 'tomorrow',
    category: 'Design',
    time: '11:00 AM',
    title: 'Review Sprint 24 Prototype',
    description: 'Walk through motion timing and focus states with product.',
    done: false,
    tone: 'secondary',
    cornerVariant: 'a',
  },
  {
    id: 'task-6',
    day: 'tomorrow',
    category: 'Engineering',
    time: '02:00 PM',
    title: 'Ship Notification Digest Batch',
    description: 'Verify digest email layout across light and dark clients.',
    done: false,
    tone: 'sky',
    cornerVariant: 'b',
  },
];

export const dashboardTeamMembers: DashboardTeamMember[] = [
  {
    person: dashboardPeople.liam,
    task: 'Kanban Drag States',
    status: 'Active',
    statusClass: 'text-light-on-secondary-container bg-secondary-soft',
  },
  {
    person: dashboardPeople.elena,
    task: 'CSV Export Flow',
    status: 'QA',
    statusClass: 'text-light-on-mint-container bg-mint-soft',
  },
  {
    person: dashboardPeople.noah,
    task: 'Calendar Sync v2',
    status: 'Sync',
    statusClass: 'text-light-on-sky-container bg-sky-soft',
  },
  {
    person: dashboardPeople.sophia,
    task: 'Empty State Copy',
    status: 'Review',
    statusClass: 'text-light-on-tertiary-container bg-tertiary-soft',
  },
];

export const sprintTabPanels: Record<SprintTabId, { label: string; cards: SprintCardItem[] }> = {
  todo: {
    label: 'To Do',
    cards: [
      {
        id: 'todo-1',
        badge: 'Urgent',
        badgeClass: 'bg-coral-soft text-light-on-coral-container',
        due: 'Due Nov 24',
        periods: ['week', 'month'],
        title: 'Sidebar Rail',
        description: 'Improve spacing and keyboard focus rings.',
        assignees: [dashboardPeople.sophia, dashboardPeople.noah],
        progress: '2/5',
        cornerVariant: 'a',
      },
      {
        id: 'todo-2',
        badge: 'High',
        badgeClass: 'bg-tertiary-soft text-light-on-tertiary-container',
        due: 'Due Nov 26',
        periods: ['week', 'month'],
        title: 'Notification Digest',
        description: 'Group daily @mentions into one summary card.',
        assignees: [dashboardPeople.liam, dashboardPeople.elena],
        progress: '1/4',
        cornerVariant: 'b',
      },
    ],
  },
  progress: {
    label: 'In Progress',
    cards: [
      {
        id: 'prog-1',
        badge: 'In Progress',
        badgeClass: 'bg-secondary-soft text-light-on-secondary-container',
        due: 'Due Nov 25',
        periods: ['week', 'month'],
        title: 'Kanban Drag States',
        description: 'Add smooth drop-zone highlights on task cards.',
        assignees: [dashboardPeople.liam],
        progress: '4/6',
        cornerVariant: 'a',
      },
      {
        id: 'prog-2',
        badge: 'Active',
        badgeClass: 'bg-sky-soft text-light-on-sky-container',
        due: 'Due Nov 27',
        periods: ['week', 'month'],
        title: 'Calendar Sync v2',
        description: 'Two-way Google Calendar event mapping.',
        assignees: [dashboardPeople.noah],
        progress: '3/5',
        cornerVariant: 'b',
      },
    ],
  },
  review: {
    label: 'Review',
    cards: [
      {
        id: 'rev-1',
        badge: 'QA Ready',
        badgeClass: 'bg-mint-soft text-light-on-mint-container',
        due: 'Today',
        periods: ['today', 'week', 'month'],
        title: 'CSV Export Flow',
        description: 'Verify filtered sprint reports download cleanly.',
        assignees: [dashboardPeople.elena],
        progress: '5/5',
        cornerVariant: 'a',
      },
      {
        id: 'rev-2',
        badge: 'Review',
        badgeClass: 'bg-secondary-soft text-light-on-secondary-container',
        due: 'Tomorrow',
        periods: ['week', 'month'],
        title: 'Empty State Copy',
        description: 'Review friendly onboarding prompts with UX writer.',
        assignees: [dashboardPeople.sophia],
        progress: '3/3',
        cornerVariant: 'b',
      },
    ],
  },
};

const BAR_POSITIONS = [7.14, 21.43, 35.71, 50, 64.29, 78.57, 92.86] as const;

export const weeklyProgressSnapshot: ProgressSnapshotData = {
  percent: 74,
  label: 'Sprint Completion',
  segments: [
    { colorClass: 'bg-light-mint', widthPercent: 58 },
    { colorClass: 'bg-tertiary-vivid', widthPercent: 24 },
    { colorClass: 'bg-light-secondary', widthPercent: 18 },
  ],
  stats: [
    { value: 34, label: 'Completed' },
    { value: 12, label: 'In Progress' },
    { value: 8, label: 'Upcoming' },
  ],
  activeWeekdayIndex: 4, // Th
  completedWeekdayIndices: [0, 1, 2, 3], // Su, Mo, Tu, We
};

function mapMockVelocityToDashboard(
  timeframeId: 'today' | 'month',
  badgeLabel: string,
): VelocityPeriodDataset {
  const source = velocityTimeframes.find((item) => item.id === timeframeId);
  if (!source) {
    return {
      badgeLabel,
      subtitle: 'No velocity data available',
      yAxisLabels: ['100%', '75%', '50%', '0%'],
      defaultActiveIndex: 0,
      bars: [],
    };
  }
  const highlightedIdx = Math.max(
    0,
    source.bars.findIndex((b) => b.highlighted),
  );
  return {
    badgeLabel,
    subtitle: `Completed vs target rate · ${source.peakLabel}`,
    yAxisLabels: ['100%', '75%', '50%', '0%'],
    defaultActiveIndex: highlightedIdx,
    bars: source.bars.map((bar, idx) => ({
      day: bar.day,
      targetPercent: bar.targetHeightPct,
      completedPercent: bar.fillHeightPct,
      completedLabel: `${bar.fillHeightPct}%`,
      targetLabel: `${bar.targetHeightPct}%`,
      posPercent: BAR_POSITIONS[idx] ?? 50,
      isDefaultActive: Boolean(bar.highlighted),
    })),
  };
}

export const dashboardVelocityByPeriod: Record<DashboardTimeframe, VelocityPeriodDataset> = {
  today: mapMockVelocityToDashboard('today', 'Today'),
  week: {
    badgeLabel: 'Last 7 Days',
    subtitle: 'Completed vs daily target',
    yAxisLabels: ['15', '10', '5', '0'],
    defaultActiveIndex: 3,
    bars: [
      { day: 'Mon', targetPercent: 60, completedPercent: 67, completedLabel: '6', targetLabel: '9', posPercent: 7.14 },
      { day: 'Tue', targetPercent: 73, completedPercent: 82, completedLabel: '9', targetLabel: '11', posPercent: 21.43 },
      { day: 'Wed', targetPercent: 87, completedPercent: 84, completedLabel: '11', targetLabel: '13', posPercent: 35.71 },
      {
        day: 'Thu',
        targetPercent: 96,
        completedPercent: 88,
        completedLabel: '14',
        targetLabel: '15',
        posPercent: 50,
        isDefaultActive: true,
      },
      { day: 'Fri', targetPercent: 80, completedPercent: 75, completedLabel: '9', targetLabel: '12', posPercent: 64.29 },
      { day: 'Sat', targetPercent: 53, completedPercent: 62, completedLabel: '5', targetLabel: '8', posPercent: 78.57 },
      { day: 'Sun', targetPercent: 47, completedPercent: 58, completedLabel: '4', targetLabel: '7', posPercent: 92.86 },
    ],
  },
  month: mapMockVelocityToDashboard('month', 'This Month'),
};

export const dashboardCalendarDays: CalendarDayItem[] = [
  { day: 15 },
  { day: 16 },
  { day: 17, tone: 'tertiary' },
  { day: 18 },
  { day: 19 },
  { day: 20, tone: 'secondary' },
  { day: 21 },
  { day: 22, tone: 'primary' },
  { day: 23 },
  { day: 24, tone: 'coral' },
  { day: 25 },
  { day: 26 },
  { day: 27, tone: 'mint' },
  { day: 28 },
];

export const dashboardMeetings: MeetingItem[] = [
  {
    id: 'meet-1',
    title: 'Daily Design Sync',
    meta: '10:00 AM • Meet',
    ctaLabel: 'Join',
    activeLabel: 'Joined',
    primary: true,
  },
  {
    id: 'meet-2',
    title: 'Sprint Retro',
    meta: '02:30 PM • Zoom',
    ctaLabel: 'RSVP',
    activeLabel: 'Going',
    primary: false,
  },
];

export const initialChatMessages: ChatMessageItem[] = [
  {
    id: 'msg-1',
    sender: dashboardPeople.liam,
    time: '09:42',
    text: 'Webhook PR is ready for review.',
    bubbleTone: 'sky',
  },
  {
    id: 'msg-2',
    sender: dashboardPeople.andra,
    time: '09:45',
    text: 'On it! Checking edge cases now.',
    outgoing: true,
  },
  {
    id: 'msg-3',
    sender: dashboardPeople.elena,
    time: '09:48',
    text: 'Updated usability notes in Figma.',
    bubbleTone: 'secondary',
  },
  {
    id: 'msg-4',
    sender: dashboardPeople.noah,
    time: '09:50',
    text: 'Calendar sync tests all passed!',
    bubbleTone: 'mint',
  },
];

export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid_view', targetId: 'dash-top' },
  { id: 'tasks', label: 'My Tasks', icon: 'task_alt', targetId: 'dash-tasks' },
  { id: 'sprints', label: 'Sprints & Boards', icon: 'layers', targetId: 'dash-sprint' },
  { id: 'projects', label: 'Projects', icon: 'folder_open', targetId: 'dash-progress' },
  { id: 'calendar', label: 'Calendar & Meetings', icon: 'calendar_today', targetId: 'dash-calendar' },
  { id: 'messages', label: 'Team Chat', icon: 'chat_bubble', targetId: 'dash-chat' },
  { id: 'team', label: 'Team', icon: 'group', targetId: 'dash-team' },
  { id: 'starred', label: 'Starred Priorities', icon: 'star', targetId: 'dash-tasks' },
  { id: 'analytics', label: 'Reports & Velocity', icon: 'bar_chart', targetId: 'dash-velocity' },
] as const;
