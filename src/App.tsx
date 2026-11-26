import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { DashboardPage } from './components/dashboard/DashboardPage';
import {
  bentoHeaderData,
  checklistTasksData,
  customerStoriesData,
  faqData,
  finalCtaData,
  focusTimerData,
  footerData,
  heroData,
  integrationsHubData,
  marqueeData,
  mobileSyncData,
  navLinks,
  pricingData,
  telemetryBandData,
  velocityTimeframes,
  workflowData,
} from './data/mockData';
import {
  CustomerStoriesWidget,
  DemoVideoModalWidget,
  FaqSplitWidget,
  FinalCtaWidget,
  FocusTimerWidget,
  FooterWidget,
  HeroStageWidget,
  IntegrationsHubWidget,
  MarqueeWidget,
  MobileSyncWidget,
  NavbarWidget,
  PricingWidget,
  RevealSection,
  TaskChecklistWidget,
  TelemetryBandWidget,
  VelocityChartWidget,
  WorkflowCarouselWidget,
  WorkspaceModalWidget,
} from './components/widgets';

function isDashboardHash(): boolean {
  return window.location.hash.toLowerCase() === '#dashboard';
}

export function App() {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>(() =>
    isDashboardHash() ? 'dashboard' : 'landing',
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Starter');

  useEffect(() => {
    const syncViewFromLocation = () => {
      const nextView = isDashboardHash() ? 'dashboard' : 'landing';
      setActiveView(nextView);
      if (nextView === 'dashboard') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('hashchange', syncViewFromLocation);
    window.addEventListener('popstate', syncViewFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncViewFromLocation);
      window.removeEventListener('popstate', syncViewFromLocation);
    };
  }, []);

  useEffect(() => {
    document.title =
      activeView === 'dashboard'
        ? 'TaskFlow — Task Management Dashboard'
        : 'TaskFlow — Plan Sprints, Ship Faster, Stay in Flow';
  }, [activeView]);

  const openDashboard = useCallback(() => {
    setModalOpen(false);
    if (!isDashboardHash()) {
      window.location.hash = 'dashboard';
    }
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const backToLanding = useCallback(() => {
    if (isDashboardHash()) {
      window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openWorkspaceModal = (planName = 'Starter') => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  const heroDashboardSrc = `${import.meta.env.BASE_URL}images/hero-dashboard-preview.png`;
  const showcaseVideoSrc = `${import.meta.env.BASE_URL}videos/taskflow-showcase-v7.mp4`;

  if (activeView === 'dashboard') {
    return (
      <MotionConfig reducedMotion="user">
        <DashboardPage onBackToLanding={backToLanding} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-light-surface text-light-on-surface font-body antialiased">
        {/* Sticky Floating Pill Navbar */}
        <NavbarWidget
          brandName={footerData.brandName}
          links={navLinks}
          onStartFree={openDashboard}
        />

        <main id="top" className="w-full overflow-x-clip">
          {/* 1. Hero Section + 3D Interactive Stage */}
          <HeroStageWidget
            statusLabel={heroData.statusLabel}
            headline={heroData.headline}
            subcopy={heroData.subcopy}
            primaryCta={heroData.primaryCta}
            secondaryCta={heroData.secondaryCta}
            dashboardImageSrc={heroDashboardSrc}
            dashboardImageAlt={heroData.dashboardImageAlt}
            flowIndex={heroData.flowIndex}
            pulseCapsule={heroData.pulseCapsule}
            momentumCard={heroData.momentumCard}
            onPrimaryCtaClick={openDashboard}
            onSecondaryCtaClick={() => setDemoVideoOpen(true)}
          />

          {/* 2. Social Proof Marquee */}
          <MarqueeWidget caption={marqueeData.caption} teams={marqueeData.teams} />

          {/* 3. Interactive 3D Bento Features */}
          <section
            id="features"
            className="scroll-mt-20 max-w-[1200px] mx-auto px-page-margin py-16 flex flex-col gap-gutter-xl"
          >
            <RevealSection>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
                <div className="max-w-[600px] flex flex-col gap-gutter-sm">
                  <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-secondary-soft text-light-secondary w-fit">
                    {bentoHeaderData.eyebrow}
                  </span>
                  <h2 className="font-headline text-headline-lg text-light-primary text-balance">
                    {bentoHeaderData.headline}
                  </h2>
                </div>
                <p className="font-body text-body-md text-light-on-surface-variant max-w-[380px] text-pretty">
                  {bentoHeaderData.description}
                </p>
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
              <RevealSection delay={0.03} className="lg:col-span-7 flex">
                <VelocityChartWidget
                  timeframes={velocityTimeframes}
                  defaultIndex={1}
                  className="w-full"
                />
              </RevealSection>

              <RevealSection delay={0.07} className="lg:col-span-5 flex">
                <TaskChecklistWidget tasks={checklistTasksData} className="w-full" />
              </RevealSection>

              <RevealSection delay={0.05} className="lg:col-span-5 flex">
                <FocusTimerWidget
                  eyebrow={focusTimerData.eyebrow}
                  syncBadge={focusTimerData.syncBadge}
                  title={focusTimerData.title}
                  description={focusTimerData.description}
                  sessionLabel={focusTimerData.sessionLabel}
                  initialSeconds={focusTimerData.initialSeconds}
                  className="w-full"
                />
              </RevealSection>

              <RevealSection delay={0.09} className="lg:col-span-7 flex">
                <MobileSyncWidget
                  eyebrow={mobileSyncData.eyebrow}
                  title={mobileSyncData.title}
                  description={mobileSyncData.description}
                  badges={mobileSyncData.badges}
                  companionTitle={mobileSyncData.companionTitle}
                  latencyLabel={mobileSyncData.latencyLabel}
                  meetingTitle={mobileSyncData.meetingTitle}
                  meetingMeta={mobileSyncData.meetingMeta}
                  navIcons={mobileSyncData.navIcons}
                  className="w-full"
                />
              </RevealSection>
            </div>
          </section>

          {/* 4. Interactive 3-Step Workflow Showcase */}
          <WorkflowCarouselWidget data={workflowData} />

          {/* 5. Impact Metrics Telemetry Band */}
          <TelemetryBandWidget
            statusLabel={telemetryBandData.statusLabel}
            caption={telemetryBandData.caption}
            metrics={telemetryBandData.metrics}
          />

          {/* 6. Integrations & Ecosystem Bento Hub */}
          <IntegrationsHubWidget
            eyebrow={integrationsHubData.eyebrow}
            headline={integrationsHubData.headline}
            description={integrationsHubData.description}
            hubStatusLabel={integrationsHubData.hubStatusLabel}
            hubLatency={integrationsHubData.hubLatency}
            hubFooterLeft={integrationsHubData.hubFooterLeft}
            hubFooterCta={integrationsHubData.hubFooterCta}
            events={integrationsHubData.events}
            cards={integrationsHubData.cards}
            onExploreApi={() => openWorkspaceModal('Pro Team API')}
          />

          {/* 7. Pricing Section */}
          <PricingWidget
            eyebrow={pricingData.eyebrow}
            headline={pricingData.headline}
            description={pricingData.description}
            tiers={pricingData.tiers}
            guarantees={pricingData.guarantees}
            onSelectPlan={(planName, cycle) => {
              if (planName === 'Pro Team') {
                openDashboard();
                return;
              }
              openWorkspaceModal(`${planName} (${cycle === 'yearly' ? 'Yearly' : 'Monthly'})`);
            }}
          />

          {/* 8. Customer Stories Asymmetric Bento */}
          <CustomerStoriesWidget
            eyebrow={customerStoriesData.eyebrow}
            headline={customerStoriesData.headline}
            ratingScore={customerStoriesData.ratingScore}
            ratingCaption={customerStoriesData.ratingCaption}
            spotlight={customerStoriesData.spotlight}
            violetOutcome={customerStoriesData.violetOutcome}
            mintQa={customerStoriesData.mintQa}
            communityProof={customerStoriesData.communityProof}
          />

          {/* 9. Interactive FAQ Split Section */}
          <FaqSplitWidget
            eyebrow={faqData.eyebrow}
            headline={faqData.headline}
            description={faqData.description}
            supportCard={faqData.supportCard}
            items={faqData.items}
            onTalkToTeam={() => openWorkspaceModal('Migration Onboarding')}
          />

          {/* 10. Final CTA Banner */}
          <FinalCtaWidget
            statusLabel={finalCtaData.statusLabel}
            headline={finalCtaData.headline}
            description={finalCtaData.description}
            primaryCta={finalCtaData.primaryCta}
            secondaryCta={finalCtaData.secondaryCta}
            card={finalCtaData.card}
            onCreateWorkspace={openDashboard}
          />
        </main>

        {/* 11. Footer */}
        <FooterWidget
          brandName={footerData.brandName}
          copyright={footerData.copyright}
          links={footerData.links}
        />

        {/* Workspace Onboarding Modal */}
        <WorkspaceModalWidget
          isOpen={modalOpen}
          selectedPlan={selectedPlan}
          onClose={() => setModalOpen(false)}
        />

        {/* Interactive Demo Motion Showcase Modal */}
        <DemoVideoModalWidget
          isOpen={demoVideoOpen}
          videoSrc={showcaseVideoSrc}
          posterSrc={heroDashboardSrc}
          onClose={() => setDemoVideoOpen(false)}
          onTryDashboard={() => {
            setDemoVideoOpen(false);
            openDashboard();
          }}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
