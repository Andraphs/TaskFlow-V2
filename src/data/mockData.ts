/**
 * Centralized product simulation data for TaskFlow.
 * Kept strictly separated from UI widgets so both the web app and future Remotion scenes
 * can inject or override props deterministically.
 */

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface MarqueeTeamItem {
  name: string;
  icon: string;
  iconColorClass: string;
}

export interface VelocityTimeframeData {
  id: 'today' | 'week' | 'month';
  label: string;
  peakLabel: string;
  bars: {
    day: string;
    targetHeightPct: number;
    fillHeightPct: number;
    highlighted?: boolean;
  }[];
}

export interface ChecklistTaskItem {
  id: string;
  title: string;
  tag: string;
  accentRingClass: string;
  defaultCompleted: boolean;
}

export interface WorkflowSlideCapacityCard {
  department: string;
  departmentColorClass: string;
  pointsLabel: string;
  taskTitle: string;
  assigneeName: string;
  assigneeAvatar: string;
  loadLabel: string;
}

export interface WorkflowData {
  eyebrow: string;
  headline: string;
  tabs: { id: string; label: string }[];
  planSlide: {
    stepNumber: string;
    badgeIcon: string;
    badgeLabel: string;
    title: string;
    description: string;
    tags: string[];
    plannerTitle: string;
    plannerStatus: string;
    segments: { colorClass: string; widthPct: number }[];
    cards: WorkflowSlideCapacityCard[];
  };
  focusSlide: {
    stepNumber: string;
    badgeIcon: string;
    badgeLabel: string;
    title: string;
    description: string;
    tags: string[];
    panelTitle: string;
    panelStatus: string;
    activeTaskTitle: string;
    activeTaskMeta: string;
    flowBadge: string;
    footerLeft: string;
    footerRight: string;
  };
  shipSlide: {
    stepNumber: string;
    badgeIcon: string;
    badgeLabel: string;
    title: string;
    description: string;
    tags: string[];
    summaryTitle: string;
    summaryBadge: string;
    stats: { value: string; label: string; valueColorClass: string }[];
    releaseNoteText: string;
    releaseChannel: string;
  };
}

export interface TelemetryMetricItem {
  id: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  badge: string;
  badgeTextClass: string;
  value: string;
  description: string;
  progressPct: number;
  barColorClass: string;
}

export interface WebhookEventItem {
  id: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  title: string;
  meta: string;
  statusType: 'arrow' | 'pill' | 'check';
  statusText?: string;
}

export interface IntegrationCardItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  badge: string;
  badgeBgClass: string;
  badgeTextClass: string;
}

export interface PricingTierItem {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  description: string;
  icon: string;
  badge: string;
  monthlyPrice: string;
  yearlyPrice: string;
  unitLabel: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
  tierTone: 'light' | 'dark' | 'enterprise';
}

export interface CustomerStoryHighlight {
  label: string;
  labelColorClass: string;
  quote: string;
}

export interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

export interface AvatarProfile {
  name: string;
  role?: string;
  avatarUrl: string;
}

export const avatars: Record<'clara' | 'dimas' | 'nadia' | 'andra' | 'kevin', AvatarProfile> = {
  clara: {
    name: 'Clara Wijaya',
    role: 'Design Lead · NovaLabs',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrA8v70HXzkMXO1udvVgCAG3rjTVKU4K6zMzcl40N_xfEQzhgu_TkCIZ0q2JO_gkno_KXPUBibTVQGoXNC5SeVS8PfTF4b2bqJ-zHGTCu30CUBdcLGL8p24n7xl8rWwDgEF-aH8argCQtAriG4uxf0Ad_VbNIQ-nUTAy3owMu_cjrkqZ-EIPNrm5AkDGcjaZ53LiAAJFEBj42pD4FbWegdqmIe0iybeXz-9UbGfXPAtLx02B2K3cyQ',
  },
  dimas: {
    name: 'Dimas Pratama',
    role: 'Staff Engineer · PayGrid',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDbqxH-sD4vJ_B-r6pFwQmATc1Jy1jv8r2B83kb1R8t3XHrgcm4QzCxkQX99rl92PnX7UmhkWEtCWMj0_RS1UDQiFdrJK_wQBdgOu9XahLuAD_nATaOdbqyWP3N91v4MXLRDEA3hBVgMf3jaW3o1oefHhmUE4sB8zIFgPT3gO5i4kVV9rxsWuZsWrYcDaOWbZDWxox5TEgMz65Sxyd6qNFwwfT5cpvB3Z2kfrLQ1LbVl_0q0_kK8Q',
  },
  nadia: {
    name: 'Nadia Kusuma',
    role: 'VP of Product · Kinetix',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCEVqxqxnbyufPxsqrYfZatlkKIGGcSQRzcX2BEB0vw_Mtfr7VS2QA7BXex0ZV7Ph84sl-RQIbuuSYCVI-_68UK_mdnQsZCts05qFpl4BohFXscF4JfSHXFgdVVZtwunkEX4wrnTmvjCQthraO_T1_VDshRtXo56fMnGdrkhYNHXpg_hGzx-WD-l9oNQpyfDYj5GpQZL0dzhCvcCfXY8QwNVUMxn2iofnUIfgSAS6_IbWKWc397xA',
  },
  andra: {
    name: 'Andra',
    role: 'Product Designer',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrAhOHVl70Pv_UfS7dqcjRHp0hojAIo8pf0UGXot3IsHTkeGuY68F_wb8iyft2De1U5p5HMBkl5nUM1lnzEgmT0AW1_DippZP50A12Z0n0mF56xAje6udU9reFZQUbktnnKP4m_H5DLO9O3I7UrGv1JTuO0Qqte4JLDwr6yGMN_2pZ5u2LDW6yMGLh3K3ewpwp2btWBk-dRZWVgJcJhfEWaIBiO_XRxRwQxQrAXXnSyv7Ff9R0xFvzAdiWqOqg',
  },
  kevin: {
    name: 'Kevin',
    role: 'Onboarding Engineer',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrDguFQ4-wBI6eP4Lazlvp3Y2vKBJRwvLmtjdMdHSA0IYazW8fQz0X7yuZ2RT2-Z-QJK3l-SHWm70cY3oy_dzy4twxoZI_pWPrd6LqwGbBQ51P87WPCOn_5T6YVFq2L1B9p8EEIp1cSa6juYQ0p4RLhC0Qde3r8YwSRtsbXX43wt-8HSaiRpTTaSxS9sD-BcnaGptF78SMVUNm0JVmv-t7qVCXvhRxztSyL7XuZVr7i53d84dlnnEw',
  },
};

export const navLinks: NavLinkItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
];

export const heroData = {
  statusLabel: 'TaskFlow 2.4 — Real-Time Sprint & Mobile Sync',
  headline: 'Your Smart Way to Manage Sprints Effortlessly',
  subcopy:
    'Unify daily tasks, team velocity charts, and live sprint check-ins in one calm workspace—built for product teams who ship every week.',
  primaryCta: 'Get Started — Free',
  secondaryCta: 'Explore Interactive Demo',
  dashboardImageAlt:
    'TaskFlow Desktop Workspace Dashboard showing Weekly Velocity, Today Tasks, and Sprint Progress',
  flowIndex: {
    percent: 74,
    label: 'Flow Index',
    delta: '+12% peak',
  },
  pulseCapsule: {
    tag: 'Pulse',
    label: 'Live Rhythm',
    bars: [
      { heightClass: 'h-4', colorClass: 'bg-light-secondary' },
      { heightClass: 'h-7', colorClass: 'bg-dark-mint' },
      { heightClass: 'h-9', colorClass: 'bg-light-secondary' },
      { heightClass: 'h-5', colorClass: 'bg-tertiary-vivid' },
      { heightClass: 'h-8', colorClass: 'bg-dark-sky' },
      { heightClass: 'h-6', colorClass: 'bg-dark-mint' },
    ],
  },
  momentumCard: {
    label: 'Momentum',
    delta: '+24%',
  },
};

export const marqueeData = {
  caption: 'Trusted by 2,400+ product & engineering teams',
  teams: [
    { name: 'Linearity', icon: 'deployed_code', iconColorClass: 'text-light-secondary' },
    { name: 'Veloce Studio', icon: 'auto_awesome', iconColorClass: 'text-light-mint' },
    { name: 'NusaCloud', icon: 'cloud_sync', iconColorClass: 'text-light-sky' },
    { name: 'Kinetix Labs', icon: 'hub', iconColorClass: 'text-light-tertiary' },
    { name: 'Arka Systems', icon: 'grid_view', iconColorClass: 'text-light-coral' },
    { name: 'PixelForge', icon: 'layers', iconColorClass: 'text-light-secondary' },
  ] satisfies MarqueeTeamItem[],
};

export const bentoHeaderData = {
  eyebrow: 'Interactive Bento Workspace',
  headline: 'Every sprint signal in motion, zero clutter',
  description:
    'Try the live widgets below—switch velocity timeframes, check off tasks, or run a focus block right here.',
};

export const velocityTimeframes: VelocityTimeframeData[] = [
  {
    id: 'today',
    label: 'Today',
    peakLabel: 'Peak: 2 PM · 94%',
    bars: [
      { day: 'Mon', targetHeightPct: 58, fillHeightPct: 48 },
      { day: 'Tue', targetHeightPct: 72, fillHeightPct: 76 },
      { day: 'Wed', targetHeightPct: 84, fillHeightPct: 94 },
      { day: 'Thu', targetHeightPct: 95, fillHeightPct: 64, highlighted: true },
      { day: 'Fri', targetHeightPct: 78, fillHeightPct: 82 },
      { day: 'Sat', targetHeightPct: 50, fillHeightPct: 40 },
      { day: 'Sun', targetHeightPct: 44, fillHeightPct: 30 },
    ],
  },
  {
    id: 'week',
    label: 'Week',
    peakLabel: 'Peak: Thu 90%',
    bars: [
      { day: 'Mon', targetHeightPct: 58, fillHeightPct: 68 },
      { day: 'Tue', targetHeightPct: 72, fillHeightPct: 82 },
      { day: 'Wed', targetHeightPct: 84, fillHeightPct: 84 },
      { day: 'Thu', targetHeightPct: 95, fillHeightPct: 90, highlighted: true },
      { day: 'Fri', targetHeightPct: 78, fillHeightPct: 75 },
      { day: 'Sat', targetHeightPct: 50, fillHeightPct: 60 },
      { day: 'Sun', targetHeightPct: 44, fillHeightPct: 56 },
    ],
  },
  {
    id: 'month',
    label: 'Month',
    peakLabel: 'Peak: Wk 3 · 96%',
    bars: [
      { day: 'Mon', targetHeightPct: 58, fillHeightPct: 72 },
      { day: 'Tue', targetHeightPct: 72, fillHeightPct: 80 },
      { day: 'Wed', targetHeightPct: 84, fillHeightPct: 88 },
      { day: 'Thu', targetHeightPct: 95, fillHeightPct: 96, highlighted: true },
      { day: 'Fri', targetHeightPct: 78, fillHeightPct: 84 },
      { day: 'Sat', targetHeightPct: 50, fillHeightPct: 74 },
      { day: 'Sun', targetHeightPct: 44, fillHeightPct: 68 },
    ],
  },
];

export const checklistTasksData: ChecklistTaskItem[] = [
  {
    id: 'task-ui-tokens',
    title: 'Design System Token Audit',
    tag: 'UI',
    accentRingClass: 'border-tertiary-vivid',
    defaultCompleted: false,
  },
  {
    id: 'task-api-webhooks',
    title: 'Sync Task Webhook Endpoints',
    tag: 'API',
    accentRingClass: 'border-dark-sky',
    defaultCompleted: false,
  },
  {
    id: 'task-pm-roadmap',
    title: 'Publish Q4 Sprint Roadmap',
    tag: 'PM',
    accentRingClass: 'border-dark-mint',
    defaultCompleted: true,
  },
];

export const focusTimerData = {
  eyebrow: 'Deep Work',
  syncBadge: 'DND Sync',
  title: 'Built-in Focus Timer',
  description: 'Stay in flow with 25-minute sprint blocks and pinned team notes.',
  sessionLabel: 'Focus Session · Sprint #14',
  initialSeconds: 25 * 60,
};

export const mobileSyncData = {
  eyebrow: 'Cross-Device',
  title: 'Desktop power, pocket speed',
  description:
    'Swipe between Home, Tasks, Sprints, and Team Chat on mobile with zero clutter—every update syncs with your desktop board in real time.',
  badges: [
    { icon: 'check_circle', iconColorClass: 'text-light-mint', label: 'iOS & Android Ready' },
    { icon: 'swipe', iconColorClass: 'text-light-secondary', label: 'Swipe Gestures' },
  ],
  companionTitle: 'Mobile Companion',
  latencyLabel: '12ms',
  meetingTitle: 'Daily Design Sync',
  meetingMeta: '10:00 · 4 online',
  navIcons: ['grid_view', 'task_alt', 'add', 'layers', 'chat_bubble'] as const,
};

export const workflowData: WorkflowData = {
  eyebrow: 'How It Works',
  headline: 'From backlog chaos to shipped sprint in three steps',
  tabs: [
    { id: 'plan', label: '1. Plan Sprint' },
    { id: 'focus', label: '2. Track & Focus' },
    { id: 'ship', label: '3. Ship & Retro' },
  ],
  planSlide: {
    stepNumber: '01',
    badgeIcon: 'auto_awesome',
    badgeLabel: 'Smart Intake',
    title: 'Auto-balance sprint capacity before Monday morning',
    description:
      'Drag backlog tickets into your sprint lane and watch TaskFlow calculate story points, flag overloaded teammates, and group dependencies automatically.',
    tags: ['Capacity Guardrails', '1-Click Rollover'],
    plannerTitle: 'Sprint 14 · Capacity Planner',
    plannerStatus: '38 / 42 pts balanced',
    segments: [
      { colorClass: 'bg-light-secondary', widthPct: 34 },
      { colorClass: 'bg-light-sky', widthPct: 36 },
      { colorClass: 'bg-light-mint', widthPct: 20 },
    ],
    cards: [
      {
        department: 'Design',
        departmentColorClass: 'text-light-secondary',
        pointsLabel: '8 pts',
        taskTitle: 'Checkout micro-interactions',
        assigneeName: 'Clara',
        assigneeAvatar: avatars.clara.avatarUrl,
        loadLabel: 'Clara · 72% load',
      },
      {
        department: 'Frontend',
        departmentColorClass: 'text-light-sky',
        pointsLabel: '13 pts',
        taskTitle: 'Optimistic board drag-and-drop',
        assigneeName: 'Dimas',
        assigneeAvatar: avatars.dimas.avatarUrl,
        loadLabel: 'Dimas · 84% load',
      },
    ],
  },
  focusSlide: {
    stepNumber: '02',
    badgeIcon: 'timer',
    badgeLabel: 'Deep Work Mode',
    title: 'Protect maker hours without losing live visibility',
    description:
      'Every task pairs with an optional Pomodoro focus session that updates your squad status to Deep Work and batches non-urgent pings until your break.',
    tags: ['Auto Status Sync', 'Blocker Alerts'],
    panelTitle: 'Active Focus Session',
    panelStatus: 'Live · Do Not Disturb',
    activeTaskTitle: 'API token refresh flow',
    activeTaskMeta: 'PR #418 linked · 22:14 remaining',
    flowBadge: 'In Flow',
    footerLeft: '3 Slack notifications batched until 15:00',
    footerRight: 'Zero interruptions',
  },
  shipSlide: {
    stepNumber: '03',
    badgeIcon: 'rocket_launch',
    badgeLabel: 'Instant Retro',
    title: 'Close sprints with automated velocity & release notes',
    description:
      'Merged PRs automatically move tickets to Shipped and compile a clean weekly changelog for stakeholders—zero manual status spreadsheets.',
    tags: ['Auto Changelog', 'Velocity Trends'],
    summaryTitle: 'Sprint 13 · Shipped Summary',
    summaryBadge: '96% Completed · +18%',
    stats: [
      { value: '34', label: 'Tasks Shipped', valueColorClass: 'text-light-primary' },
      { value: '1.4d', label: 'Avg Cycle Time', valueColorClass: 'text-light-secondary' },
      { value: '0', label: 'Missed Handoffs', valueColorClass: 'text-light-mint' },
    ],
    releaseNoteText: 'Release Notes v2.4.1 generated',
    releaseChannel: 'Shared to #releases',
  },
};

export const telemetryBandData = {
  statusLabel: 'Verified Sprint Telemetry · Q4 Benchmark',
  caption: 'Across 2,400+ active product teams',
  metrics: [
    {
      id: 'faster-delivery',
      icon: 'trending_up',
      iconBgClass: 'bg-light-secondary',
      iconTextClass: 'text-light-on-secondary',
      badge: '+18% QoQ',
      badgeTextClass: 'text-dark-mint',
      value: '42%',
      description: 'Faster sprint delivery across product squads',
      progressPct: 78,
      barColorClass: 'bg-light-secondary',
    },
    {
      id: 'clearer-handoffs',
      icon: 'handshake',
      iconBgClass: 'bg-light-mint',
      iconTextClass: 'text-light-on-mint',
      badge: 'Design → Eng',
      badgeTextClass: 'text-light-on-primary/80',
      value: '2.4x',
      description: 'Clearer design-to-engineering handoffs',
      progressPct: 86,
      barColorClass: 'bg-dark-mint',
    },
    {
      id: 'sync-uptime',
      icon: 'bolt',
      iconBgClass: 'bg-light-sky',
      iconTextClass: 'text-light-on-sky',
      badge: 'Web & Mobile',
      badgeTextClass: 'text-dark-sky',
      value: '99.98%',
      description: 'Realtime sync uptime across all devices',
      progressPct: 98,
      barColorClass: 'bg-dark-sky',
    },
    {
      id: 'standup-saved',
      icon: 'schedule',
      iconBgClass: 'bg-tertiary-vivid',
      iconTextClass: 'text-light-primary',
      badge: 'Per Standup',
      badgeTextClass: 'text-light-on-primary/80',
      value: '14 min',
      description: 'Saved per daily standup with live digests',
      progressPct: 72,
      barColorClass: 'bg-tertiary-vivid',
    },
  ] satisfies TelemetryMetricItem[],
};

export const integrationsHubData = {
  eyebrow: 'Connected Stack',
  headline: 'Plugs straight into the tools your team already lives in',
  description:
    'Two-way webhooks keep designs, pull requests, and calendar blocks in sync without extra bots.',
  hubStatusLabel: 'Live 2-Way Sync',
  hubLatency: '14ms latency',
  hubFooterLeft: '24+ native webhooks & REST API',
  hubFooterCta: 'Explore API →',
  events: [
    {
      id: 'evt-figma',
      icon: 'design_services',
      iconBgClass: 'bg-light-secondary',
      iconTextClass: 'text-light-on-secondary',
      title: 'Figma frame approved',
      meta: 'Checkout v3 · 2s ago',
      statusType: 'arrow',
    },
    {
      id: 'evt-github',
      icon: 'code',
      iconBgClass: 'bg-light-mint',
      iconTextClass: 'text-light-on-mint',
      title: 'GitHub PR #418 merged',
      meta: 'Moved ticket → Shipped',
      statusType: 'pill',
      statusText: 'Done',
    },
    {
      id: 'evt-slack',
      icon: 'forum',
      iconBgClass: 'bg-light-sky',
      iconTextClass: 'text-light-on-sky',
      title: 'Slack #sprint-q4 notified',
      meta: 'Digest sent to 6 members',
      statusType: 'check',
    },
  ] satisfies WebhookEventItem[],
  cards: [
    {
      id: 'int-figma',
      name: 'Figma',
      description: 'Embed live frames & sync review status.',
      icon: 'design_services',
      iconBgClass: 'bg-secondary-soft',
      iconTextClass: 'text-light-secondary',
      badge: '2-Way',
      badgeBgClass: 'bg-mint-soft',
      badgeTextClass: 'text-light-mint',
    },
    {
      id: 'int-github',
      name: 'GitHub',
      description: 'Auto-close tasks when PRs merge.',
      icon: 'code',
      iconBgClass: 'bg-neutral-canvas',
      iconTextClass: 'text-light-primary',
      badge: 'Auto PR',
      badgeBgClass: 'bg-mint-soft',
      badgeTextClass: 'text-light-mint',
    },
    {
      id: 'int-slack',
      name: 'Slack',
      description: 'Turn any thread into a sprint ticket.',
      icon: 'forum',
      iconBgClass: 'bg-sky-soft',
      iconTextClass: 'text-light-sky',
      badge: 'Instant',
      badgeBgClass: 'bg-secondary-soft',
      badgeTextClass: 'text-light-secondary',
    },
    {
      id: 'int-gcal',
      name: 'Google Calendar',
      description: 'Time-block focus tasks onto your day.',
      icon: 'calendar_month',
      iconBgClass: 'bg-tertiary-soft',
      iconTextClass: 'text-light-tertiary',
      badge: 'Live',
      badgeBgClass: 'bg-mint-soft',
      badgeTextClass: 'text-light-mint',
    },
    {
      id: 'int-notion',
      name: 'Notion',
      description: 'Link product specs & PRDs to tasks.',
      icon: 'description',
      iconBgClass: 'bg-neutral-canvas',
      iconTextClass: 'text-light-primary',
      badge: '2-Way',
      badgeBgClass: 'bg-mint-soft',
      badgeTextClass: 'text-light-mint',
    },
    {
      id: 'int-vercel',
      name: 'Vercel',
      description: 'Attach preview URLs to every QA card.',
      icon: 'cloud_done',
      iconBgClass: 'bg-mint-soft',
      iconTextClass: 'text-light-mint',
      badge: 'Preview',
      badgeBgClass: 'bg-secondary-soft',
      badgeTextClass: 'text-light-secondary',
    },
  ] satisfies IntegrationCardItem[],
};

export const pricingData = {
  eyebrow: 'Simple, Transparent Pricing',
  headline: 'Start free, scale with your sprint team',
  description:
    'Every plan includes real-time web & mobile sync. Upgrade only when your squad grows.',
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For solo makers & small side projects.',
      icon: 'bolt',
      badge: 'Free Forever',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      unitLabel: '/ month',
      features: [
        'Up to 3 active sprints',
        'Desktop & mobile sync',
        'Built-in focus timer',
      ],
      ctaLabel: 'Get Starter',
      tierTone: 'light',
    },
    {
      id: 'pro',
      name: 'Pro Team',
      description: 'For agile product & design squads shipping weekly.',
      icon: 'rocket_launch',
      badge: 'Most Popular',
      monthlyPrice: '$12',
      yearlyPrice: '$9',
      unitLabel: '/ user / month',
      features: [
        'Unlimited sprints & velocity charts',
        'Real-time team chat & calendar sync',
        'Figma, GitHub & Slack 2-way webhooks',
        'Unlimited view-only guests',
      ],
      ctaLabel: 'Start 14-Day Free Trial',
      featured: true,
      tierTone: 'dark',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For multi-squad organizations at scale.',
      icon: 'shield',
      badge: 'Scale & SLA',
      monthlyPrice: '$29',
      yearlyPrice: '$23',
      unitLabel: '/ user / month',
      features: [
        'SSO, SAML, SCIM & audit logs',
        'Dedicated workspace onboarding',
        '99.99% uptime SLA & priority support',
      ],
      ctaLabel: 'Contact Sales',
      tierTone: 'enterprise',
    },
  ] satisfies PricingTierItem[],
  guarantees: [
    { icon: 'verified_user', iconColorClass: 'text-light-mint', label: 'SOC 2 Type II Certified' },
    { icon: 'credit_card_off', iconColorClass: 'text-light-secondary', label: 'No credit card required' },
    { icon: 'sync_alt', iconColorClass: 'text-light-sky', label: '1-click import from Jira & Linear' },
  ],
};

export const customerStoriesData = {
  eyebrow: 'Loved by Product Squads',
  headline: 'Teams that ship faster without the standup bloat',
  ratingScore: '4.9 / 5',
  ratingCaption: 'from 2,400+ squads',
  spotlight: {
    badge: '+42% Sprint Handoff Speed',
    quote:
      '“We replaced three separate sprint trackers with TaskFlow. Our designers and engineers finally look at the exact same priorities every morning.”',
    author: avatars.nadia,
    squadSize: '38-person squad',
  },
  violetOutcome: {
    badge: '-50% Weekly Meetings',
    quote:
      '“The built-in Focus Timer and mobile handoff cut our weekly status meetings in half. Everyone knows what’s shipping before noon.”',
    author: avatars.dimas,
  },
  mintQa: {
    badge: '0 Lost QA Threads',
    quote:
      '“Figma frame previews inside sprint cards made design QA effortless. Zero lost feedback threads since we switched.”',
    author: avatars.clara,
  },
  communityProof: {
    title: 'Built for hybrid squads',
    subtitle: 'Designers, engineers & PMs in one flow',
    retentionBadge: '98% Retention',
    members: [avatars.andra, avatars.nadia, avatars.dimas, avatars.clara, avatars.kevin],
    highlights: [
      {
        label: 'Design Sync',
        labelColorClass: 'text-light-secondary',
        quote: '“Best Figma-to-Sprint handoff we’ve used.”',
      },
      {
        label: 'Mobile Speed',
        labelColorClass: 'text-light-mint',
        quote: '“Checking tasks on the train feels instant.”',
      },
      {
        label: 'Focus Mode',
        labelColorClass: 'text-light-sky',
        quote: '“Finally a tracker that protects deep work.”',
      },
    ] satisfies CustomerStoryHighlight[],
  },
};

export const faqData = {
  eyebrow: 'Questions & Answers',
  headline: 'Everything you need to know before switching',
  description:
    'Clear answers on migration, offline mobile sync, guest seats, and enterprise security.',
  supportCard: {
    replyBadge: 'Avg reply < 4 min',
    title: 'Need a custom migration plan?',
    description:
      'Our onboarding engineers help teams move active Jira or Linear sprints in one session.',
    ctaLabel: 'Talk to Product Team',
    specialists: [avatars.nadia, avatars.kevin],
  },
  items: [
    {
      number: '01',
      question: 'How fast can we migrate from Jira or Linear?',
      answer:
        'One-click OAuth importers bring over your active sprints, labels, assignees, and comment history in under two minutes—with zero downtime for your squad.',
    },
    {
      number: '02',
      question: 'Does TaskFlow Mobile sync offline?',
      answer:
        'Yes. You can check off tasks, reorder your Today queue, and reply to sprint threads offline—changes reconcile automatically the moment you reconnect.',
    },
    {
      number: '03',
      question: 'Can we invite external clients or guests for free?',
      answer:
        'Pro Team and Enterprise workspaces include unlimited view-only stakeholders and scoped project guests at no extra seat cost.',
    },
    {
      number: '04',
      question: 'Is our workspace data encrypted and SOC 2 compliant?',
      answer:
        'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Enterprise plans also support SAML SSO, SCIM provisioning, and audit log exports.',
    },
  ] satisfies FaqItem[],
};

export const finalCtaData = {
  statusLabel: 'Ready in 60 seconds',
  headline: 'Ready to get your team in flow?',
  description:
    'Launch your first sprint workspace with live desktop & mobile sync—no credit card required.',
  primaryCta: 'Create Free Workspace',
  secondaryCta: 'Compare Plans',
  card: {
    title: 'Sprint 15 · Kickoff',
    badge: 'Template Ready',
    checklist: ['Import Jira / Linear backlog', 'Connect Figma & GitHub'],
    avatars: [avatars.andra, avatars.nadia, avatars.dimas],
    footerMetric: '2,400+ squads active',
  },
};

export const footerData = {
  brandName: 'TaskFlow',
  copyright: '© 2026 TaskFlow Inc.',
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Customers', href: '#customers' },
  ] satisfies NavLinkItem[],
};
