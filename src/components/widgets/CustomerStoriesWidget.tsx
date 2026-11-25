import type { AvatarProfile, CustomerStoryHighlight } from '../../data/mockData';
import { Avatar } from './Avatar';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface CustomerStoriesWidgetProps {
  eyebrow: string;
  headline: string;
  ratingScore: string;
  ratingCaption: string;
  spotlight: {
    badge: string;
    quote: string;
    author: AvatarProfile;
    squadSize: string;
  };
  violetOutcome: {
    badge: string;
    quote: string;
    author: AvatarProfile;
  };
  mintQa: {
    badge: string;
    quote: string;
    author: AvatarProfile;
  };
  communityProof: {
    title: string;
    subtitle: string;
    retentionBadge: string;
    members: AvatarProfile[];
    highlights: CustomerStoryHighlight[];
  };
  immediate?: boolean;
}

function FiveStars({ ariaLabel }: { ariaLabel?: string }) {
  return (
    <div
      className="flex items-center gap-0.5 text-tertiary-vivid"
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <MaterialIcon key={i} name="star" size={15} filled />
      ))}
    </div>
  );
}

export function CustomerStoriesWidget({
  eyebrow,
  headline,
  ratingScore,
  ratingCaption,
  spotlight,
  violetOutcome,
  mintQa,
  communityProof,
  immediate = false,
}: CustomerStoriesWidgetProps) {
  return (
    <section
      id="customers"
      className="max-w-[1120px] mx-auto px-page-margin py-16 flex flex-col gap-gutter-xl"
    >
      <RevealSection immediate={immediate}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
          <div className="max-w-[540px] flex flex-col gap-gutter-sm">
            <span className="font-body text-label-sm text-light-secondary">{eyebrow}</span>
            <h2 className="font-headline text-headline-lg text-light-primary text-balance">
              {headline}
            </h2>
          </div>
          <div className="inline-flex items-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-light-surface-container-lowest border border-light-outline-variant/50 w-fit">
            <FiveStars />
            <span className="font-body text-label-lg text-light-on-surface tabular-nums">
              {ratingScore}
            </span>
            <span className="font-body text-body-sm text-light-on-surface-variant">
              {ratingCaption}
            </span>
          </div>
        </div>
      </RevealSection>

      {/* Asymmetric 12-Col Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
        {/* Row 1 Left (7 cols): Dark Case-Study Spotlight */}
        <RevealSection immediate={immediate} delay={0.03} className="lg:col-span-7 flex">
          <article className="w-full bento-3d bg-light-primary text-light-on-primary rounded-xl p-gutter-xl md:p-8 flex flex-col justify-between gap-gutter-xl">
            <div className="flex items-center justify-between gap-gutter-md">
              <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-light-primary-container text-dark-mint border border-dark-mint/30 tabular-nums">
                {spotlight.badge}
              </span>
              <MaterialIcon
                name="format_quote"
                size={28}
                className="text-light-on-primary/40"
              />
            </div>
            <p className="font-headline text-headline-md text-light-on-primary text-pretty">
              {spotlight.quote}
            </p>
            <div className="flex items-center justify-between gap-gutter-md pt-gutter-md border-t border-light-on-primary/15">
              <div className="flex items-center gap-gutter-md">
                <Avatar
                  src={spotlight.author.avatarUrl}
                  alt={spotlight.author.name}
                  className="w-11 h-11 border-2 border-light-secondary"
                />
                <div className="flex flex-col">
                  <span className="font-body text-label-lg text-light-on-primary">
                    {spotlight.author.name}
                  </span>
                  <span className="font-body text-body-sm text-light-on-primary/70">
                    {spotlight.author.role}
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-block font-mono text-mono-sm px-gutter-md py-1 rounded-full bg-light-primary-container text-light-on-primary/80 tabular-nums">
                {spotlight.squadSize}
              </span>
            </div>
          </article>
        </RevealSection>

        {/* Row 1 Right (5 cols): Soft Violet Outcome Card */}
        <RevealSection immediate={immediate} delay={0.07} className="lg:col-span-5 flex">
          <article className="w-full bento-3d bg-secondary-soft rounded-xl border border-light-secondary/20 p-gutter-xl flex flex-col justify-between gap-gutter-lg">
            <div className="flex items-center justify-between gap-gutter-sm">
              <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-light-surface-container-lowest text-light-secondary tabular-nums">
                {violetOutcome.badge}
              </span>
              <FiveStars ariaLabel="5 out of 5 stars" />
            </div>
            <p className="font-body text-body-md text-light-on-surface">
              {violetOutcome.quote}
            </p>
            <div className="flex items-center gap-gutter-md pt-gutter-sm border-t border-light-secondary/15">
              <Avatar
                src={violetOutcome.author.avatarUrl}
                alt={violetOutcome.author.name}
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="font-body text-label-lg text-light-on-surface">
                  {violetOutcome.author.name}
                </span>
                <span className="font-body text-body-sm text-light-on-surface-variant">
                  {violetOutcome.author.role}
                </span>
              </div>
            </div>
          </article>
        </RevealSection>

        {/* Row 2 Left (5 cols): Soft Mint Design QA Card */}
        <RevealSection immediate={immediate} delay={0.05} className="lg:col-span-5 flex">
          <article className="w-full bento-3d bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-xl flex flex-col justify-between gap-gutter-lg">
            <div className="flex items-center justify-between gap-gutter-sm">
              <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-mint-soft text-light-mint tabular-nums">
                {mintQa.badge}
              </span>
              <FiveStars ariaLabel="5 out of 5 stars" />
            </div>
            <p className="font-body text-body-md text-light-on-surface">{mintQa.quote}</p>
            <div className="flex items-center gap-gutter-md pt-gutter-sm border-t border-light-outline-variant/40">
              <Avatar
                src={mintQa.author.avatarUrl}
                alt={mintQa.author.name}
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="font-body text-label-lg text-light-on-surface">
                  {mintQa.author.name}
                </span>
                <span className="font-body text-body-sm text-light-on-surface-variant">
                  {mintQa.author.role}
                </span>
              </div>
            </div>
          </article>
        </RevealSection>

        {/* Row 2 Right (7 cols): Community Proof & Highlights Card */}
        <RevealSection immediate={immediate} delay={0.09} className="lg:col-span-7 flex">
          <article className="w-full bento-3d bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 p-gutter-xl flex flex-col justify-between gap-gutter-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
              <div className="flex items-center gap-gutter-md">
                <div className="flex -space-x-2.5">
                  {communityProof.members.map((member) => (
                    <Avatar
                      key={member.name}
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-10 h-10 border-2 border-light-surface-container-lowest"
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-title-md text-light-on-surface">
                    {communityProof.title}
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    {communityProof.subtitle}
                  </span>
                </div>
              </div>
              <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-sky-soft text-light-sky w-fit tabular-nums">
                {communityProof.retentionBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-sm">
              {communityProof.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="bg-neutral-canvas rounded-lg p-gutter-md flex flex-col gap-1"
                >
                  <span className={`font-body text-label-sm ${highlight.labelColorClass}`}>
                    {highlight.label}
                  </span>
                  <p className="font-body text-body-sm text-light-on-surface">
                    {highlight.quote}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </RevealSection>
      </div>
    </section>
  );
}
