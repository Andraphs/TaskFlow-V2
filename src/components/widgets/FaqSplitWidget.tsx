import { useState } from 'react';
import type { AvatarProfile, FaqItem } from '../../data/mockData';
import { Avatar } from './Avatar';
import { MaterialIcon } from './MaterialIcon';
import { RevealSection } from './RevealSection';

export interface FaqSplitWidgetProps {
  eyebrow: string;
  headline: string;
  description: string;
  supportCard: {
    replyBadge: string;
    title: string;
    description: string;
    ctaLabel: string;
    specialists: AvatarProfile[];
  };
  items: FaqItem[];
  /** Controlled open item indices for Remotion renders */
  openIndicesOverride?: number[];
  onTalkToTeam?: () => void;
  immediate?: boolean;
}

export function FaqSplitWidget({
  eyebrow,
  headline,
  description,
  supportCard,
  items,
  openIndicesOverride,
  onTalkToTeam,
  immediate = false,
}: FaqSplitWidgetProps) {
  const [internalOpenIndices, setInternalOpenIndices] = useState<number[]>([0]);
  const openIndices = openIndicesOverride ?? internalOpenIndices;

  const toggleIndex = (idx: number) => {
    if (openIndicesOverride !== undefined) return;
    setInternalOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="max-w-[1120px] mx-auto px-page-margin py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-start">
        {/* Left 5 Cols: Intro + Quick Support Card */}
        <RevealSection immediate={immediate} className="lg:col-span-5 flex flex-col gap-gutter-lg">
          <div className="flex flex-col gap-gutter-sm">
            <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-secondary-soft text-light-secondary w-fit">
              {eyebrow}
            </span>
            <h2 className="font-headline text-headline-lg text-light-primary text-balance">
              {headline}
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">{description}</p>
          </div>

          <div className="bento-3d bg-secondary-soft rounded-xl border border-light-secondary/20 p-gutter-xl flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between gap-gutter-sm">
              <div className="flex -space-x-2">
                {supportCard.specialists.map((person) => (
                  <Avatar
                    key={person.name}
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-9 h-9 border-2 border-light-surface-container-lowest"
                  />
                ))}
              </div>
              <span className="font-body text-label-sm px-gutter-md py-1 rounded-full bg-light-surface-container-lowest text-light-mint tabular-nums">
                {supportCard.replyBadge}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline text-title-md text-light-on-surface">
                {supportCard.title}
              </h3>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                {supportCard.description}
              </p>
            </div>
            {onTalkToTeam ? (
              <button
                type="button"
                onClick={onTalkToTeam}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-light-primary text-light-on-primary font-body text-label-lg hover:opacity-90 active:scale-95 transition-all w-fit"
              >
                <span>{supportCard.ctaLabel}</span>
                <MaterialIcon name="arrow_forward" size={16} />
              </button>
            ) : (
              <a
                href="#cta"
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-light-primary text-light-on-primary font-body text-label-lg hover:opacity-90 active:scale-95 transition-all w-fit"
              >
                <span>{supportCard.ctaLabel}</span>
                <MaterialIcon name="arrow_forward" size={16} />
              </a>
            )}
          </div>
        </RevealSection>

        {/* Right 7 Cols: Numbered Interactive Accordion */}
        <div className="lg:col-span-7 flex flex-col gap-gutter-sm" id="faq-list">
          {items.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            const panelId = `faq-panel-${item.number}`;
            return (
              <RevealSection key={item.number} immediate={immediate} delay={idx * 0.03}>
                <div className="bg-light-surface-container-lowest rounded-xl border border-light-outline-variant/50 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full px-gutter-xl py-gutter-lg flex items-center justify-between gap-gutter-md text-left hover:bg-light-surface/60 transition-colors"
                  >
                    <div className="flex items-center gap-gutter-md">
                      <span
                        className={`font-mono text-mono-sm px-gutter-sm py-0.5 rounded-md shrink-0 tabular-nums transition-colors ${
                          isOpen
                            ? 'bg-secondary-soft text-light-secondary'
                            : 'bg-neutral-canvas text-light-on-surface-variant'
                        }`}
                      >
                        {item.number}
                      </span>
                      <span className="font-headline text-title-md text-light-on-surface">
                        {item.question}
                      </span>
                    </div>
                    <MaterialIcon
                      name="expand_more"
                      size={20}
                      className={`text-light-on-surface-variant transition-transform duration-300 ease-out shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div id={panelId} className="faq-panel" data-open={String(isOpen)}>
                    <div className="faq-panel-inner">
                      <div className="px-gutter-xl pb-gutter-lg sm:pl-[68px]">
                        <p className="font-body text-body-md text-light-on-surface-variant">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
