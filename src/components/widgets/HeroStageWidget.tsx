import { type PointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';

export interface HeroStageWidgetProps {
  statusLabel: string;
  headline: string;
  subcopy: string;
  primaryCta: string;
  secondaryCta: string;
  dashboardImageSrc: string;
  dashboardImageAlt: string;
  flowIndex: {
    percent: number;
    label: string;
    delta: string;
  };
  pulseCapsule: {
    tag: string;
    label: string;
    bars: { heightClass: string; colorClass: string }[];
  };
  momentumCard: {
    label: string;
    delta: string;
  };
  /** Optional deterministic tilt override for Remotion renders */
  tiltOverride?: { x: number; y: number };
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

export function HeroStageWidget({
  statusLabel,
  headline,
  subcopy,
  primaryCta,
  secondaryCta,
  dashboardImageSrc,
  dashboardImageAlt,
  flowIndex,
  pulseCapsule,
  momentumCard,
  tiltOverride,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: HeroStageWidgetProps) {
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerActive = useMotionValue(0);

  const cardX = useSpring(pointerX, stitchMotion.springTiltCard);
  const cardY = useSpring(pointerY, stitchMotion.springTiltCard);
  const cardActive = useSpring(pointerActive, stitchMotion.springTiltCard);

  const floatX = useSpring(pointerX, stitchMotion.springTiltFloat);
  const floatY = useSpring(pointerY, stitchMotion.springTiltFloat);

  const cardTransform = useTransform(
    [cardX, cardY, cardActive],
    ([x, y, active]: number[]) =>
      `rotateY(${(x * 9).toFixed(3)}deg) rotateX(${(4 - y * 7).toFixed(3)}deg) translateZ(${(active * 14).toFixed(2)}px)`,
  );

  const planeATransform = useTransform(
    [floatX, floatY],
    ([x, y]: number[]) => `translate3d(${(x * -12).toFixed(2)}px, ${(y * -8).toFixed(2)}px, 0)`,
  );

  const planeBTransform = useTransform(
    [floatX, floatY],
    ([x, y]: number[]) => `translate3d(${(x * 12).toFixed(2)}px, ${(y * 8).toFixed(2)}px, 0)`,
  );

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || shouldReduceMotion || tiltOverride) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = (event.clientX - rect.left) / rect.width - 0.5;
    const rawY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(Math.max(-0.5, Math.min(0.5, rawX)));
    pointerY.set(Math.max(-0.5, Math.min(0.5, rawY)));
    pointerActive.set(1);
  };

  const handlePointerLeave = () => {
    if (tiltOverride) return;
    pointerX.set(0);
    pointerY.set(0);
    pointerActive.set(0);
  };

  const resolvedCardTransform = tiltOverride
    ? `rotateY(${tiltOverride.x * 9}deg) rotateX(${4 - tiltOverride.y * 7}deg) translateZ(14px)`
    : shouldReduceMotion
      ? 'none'
      : cardTransform;

  const resolvedPlaneATransform = tiltOverride
    ? `translate3d(${tiltOverride.x * -12}px, ${tiltOverride.y * -8}px, 0)`
    : shouldReduceMotion
      ? 'none'
      : planeATransform;

  const resolvedPlaneBTransform = tiltOverride
    ? `translate3d(${tiltOverride.x * 12}px, ${tiltOverride.y * 8}px, 0)`
    : shouldReduceMotion
      ? 'none'
      : planeBTransform;

  const circumference = 138.2;
  const strokeDashoffset = circumference - (circumference * flowIndex.percent) / 100;

  return (
    <section className="relative max-w-[1200px] mx-auto px-page-margin pt-section pb-16 flex flex-col items-center text-center gap-gutter-xl">
      {/* Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: stitchMotion.easeHeavyDecel }}
        className="inline-flex items-center gap-gutter-sm bg-light-surface-container-lowest border border-light-outline-variant/50 rounded-full px-gutter-md py-gutter-xs shadow-sm"
      >
        <span className="relative inline-block w-2 h-2 rounded-full bg-light-mint ping-dot" />
        <span className="font-body text-label-sm text-light-on-surface">
          {statusLabel}
        </span>
      </motion.div>

      {/* Headline & Subcopy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.04, ease: stitchMotion.easeHeavyDecel }}
        className="max-w-[740px] flex flex-col items-center gap-gutter-md"
      >
        <h1 className="font-headline text-display-lg-mobile sm:text-display-lg text-light-primary text-balance">
          {headline}
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant max-w-[560px] text-pretty">
          {subcopy}
        </p>
      </motion.div>

      {/* Dual CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.08, ease: stitchMotion.easeHeavyDecel }}
        className="flex flex-wrap items-center justify-center gap-gutter-md"
      >
        {onPrimaryCtaClick ? (
          <button
            type="button"
            onClick={onPrimaryCtaClick}
            className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-secondary text-light-on-secondary shadow-[0_12px_28px_-8px_rgba(82,32,229,0.45)] hover:scale-[1.02] active:scale-95 transition-transform duration-150"
          >
            <span className="font-body text-label-lg">{primaryCta}</span>
            <MaterialIcon name="bolt" size={18} />
          </button>
        ) : (
          <a
            href="#cta"
            className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-secondary text-light-on-secondary shadow-[0_12px_28px_-8px_rgba(82,32,229,0.45)] hover:scale-[1.02] active:scale-95 transition-transform duration-150"
          >
            <span className="font-body text-label-lg">{primaryCta}</span>
            <MaterialIcon name="bolt" size={18} />
          </a>
        )}
        {onSecondaryCtaClick ? (
          <button
            type="button"
            onClick={onSecondaryCtaClick}
            className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-surface-container-lowest border border-light-outline-variant/60 text-light-on-surface hover:bg-neutral-canvas active:scale-95 transition-all duration-150"
          >
            <MaterialIcon name="play_circle" size={18} className="text-light-secondary" />
            <span className="font-body text-label-lg">{secondaryCta}</span>
          </button>
        ) : (
          <a
            href="#features"
            className="inline-flex items-center gap-gutter-sm px-gutter-xl py-gutter-md rounded-full bg-light-surface-container-lowest border border-light-outline-variant/60 text-light-on-surface hover:bg-neutral-canvas active:scale-95 transition-all duration-150"
          >
            <MaterialIcon name="play_circle" size={18} className="text-light-secondary" />
            <span className="font-body text-label-lg">{secondaryCta}</span>
          </a>
        )}
      </motion.div>

      {/* 3D FULL-DASHBOARD + ABSTRACT GEOMETRIC STAGE */}
      <motion.div
        id="hero-3d-stage"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.12, ease: stitchMotion.easeHeavyDecel }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="hero-stage relative w-full max-w-[1060px] mt-gutter-lg pt-gutter-md pb-gutter-xl"
      >
        {/* Abstract Aurora Mesh + Subtle Dot Matrix Backdrop (100% Stitch Fidelity) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 top-0 bottom-0 -z-10 overflow-visible"
        >
          <div
            className="absolute inset-x-8 top-6 bottom-6 rounded-3xl opacity-45"
            style={{
              backgroundImage: 'radial-gradient(rgba(82, 32, 229, 0.22) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="absolute -top-6 left-10 w-72 h-72 rounded-full bg-light-secondary/20 blur-3xl" />
          <div className="absolute -bottom-8 right-12 w-80 h-80 rounded-full bg-light-mint/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full bg-sky-soft/60 blur-3xl" />
          <div className="hidden md:block absolute -top-8 right-12 w-56 h-56 rounded-full border border-dashed border-light-secondary/25" />
          <div className="hidden md:block absolute -bottom-10 left-12 w-64 h-64 rounded-full border border-light-mint/25" />
        </div>

        {/* Abstract Accent 1 (Top-Left): Frosted Radial Progress Orb */}
        <motion.div
          style={{ transform: resolvedPlaneATransform }}
          className="hero-float-plane hidden lg:block absolute -top-4 left-0 lg:-left-4 z-30"
        >
          <div className="anim-float-slow flex bg-light-surface-container-lowest/85 backdrop-blur-xl rounded-2xl border border-light-outline-variant/60 p-gutter-md shadow-[0_24px_48px_-14px_rgba(82,32,229,0.22)] items-center gap-gutter-md text-left">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#E9EBF5" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="url(#heroOrbGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
                <defs>
                  <linearGradient id="heroOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5220E5" />
                    <stop offset="100%" stopColor="#00885A" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute font-mono text-mono-sm text-light-primary tabular-nums">
                {flowIndex.percent}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-body text-label-sm text-light-on-surface">
                {flowIndex.label}
              </span>
              <span className="font-mono text-mono-sm text-light-mint tabular-nums">
                {flowIndex.delta}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Abstract Accent 2 (Bottom-Left): Dark Spectrum Pulse Capsule */}
        <motion.div
          style={{ transform: resolvedPlaneATransform }}
          className="hero-float-plane hidden lg:block absolute bottom-6 left-2 lg:-left-5 z-30"
        >
          <div className="anim-float-alt-rev flex bg-light-primary/95 backdrop-blur-xl text-light-on-primary rounded-2xl border border-light-on-primary/15 px-gutter-lg py-gutter-md shadow-[0_24px_48px_-14px_rgba(8,12,22,0.4)] items-center gap-gutter-md">
            <div className="flex items-end gap-1.5 h-9" aria-hidden="true">
              {pulseCapsule.bars.map((bar, index) => (
                <span
                  key={index}
                  className={`w-1.5 ${bar.heightClass} rounded-full ${bar.colorClass}`}
                />
              ))}
            </div>
            <div className="flex flex-col text-left">
              <span className="inline-flex items-center gap-1.5 font-mono text-mono-sm text-dark-mint">
                <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-dark-mint ping-dot" />
                {pulseCapsule.tag}
              </span>
              <span className="font-body text-label-sm text-light-on-primary/90">
                {pulseCapsule.label}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Abstract Accent 3 (Top-Right): Layered 3D Glass Prism Cluster */}
        <motion.div
          style={{ transform: resolvedPlaneBTransform }}
          className="hero-float-plane hidden lg:block absolute -top-6 right-2 lg:-right-4 z-30"
          aria-hidden="true"
        >
          <div className="anim-float-med flex w-24 h-24 items-center justify-center relative">
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-light-secondary/35 to-light-mint/30 backdrop-blur-md border border-light-surface-container-lowest/70 rotate-12 shadow-[0_20px_40px_-12px_rgba(82,32,229,0.28)]" />
            <div className="relative w-14 h-14 rounded-2xl bg-light-surface-container-lowest/90 backdrop-blur-xl border border-light-outline-variant/60 -rotate-6 shadow-lg flex items-center justify-center">
              <MaterialIcon name="bolt" size={24} className="text-light-secondary" />
            </div>
          </div>
        </motion.div>

        {/* Centerpiece: Clean Crisp 3D Tilting Full-Dashboard Frame */}
        <motion.div
          id="hero-tilt-card"
          style={{ transform: resolvedCardTransform }}
          className="hero-tilt-card relative z-10 max-w-[840px] mx-auto bg-light-surface-container-lowest rounded-2xl border border-light-outline-variant/60 p-2 shadow-[0_36px_80px_-20px_rgba(11,28,48,0.24)]"
        >
          <div className="overflow-hidden rounded-xl bg-neutral-canvas">
            <img
              id="hero-dashboard-img"
              src={dashboardImageSrc}
              alt={dashboardImageAlt}
              {...({ fetchpriority: 'high' } as Record<string, string>)}
              decoding="async"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>

        {/* Abstract Accent 4 (Bottom-Right): Frosted Bezier Velocity Spline */}
        <motion.div
          style={{ transform: resolvedPlaneBTransform }}
          className="hero-float-plane hidden lg:block absolute -bottom-3 right-0 lg:-right-4 z-30"
        >
          <div className="anim-float-alt flex w-[204px] bg-light-surface-container-lowest/85 backdrop-blur-xl rounded-2xl border border-light-outline-variant/60 p-gutter-md shadow-[0_24px_48px_-14px_rgba(11,28,48,0.2)] flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-body text-label-sm text-light-on-surface-variant">
                {momentumCard.label}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-mint-soft text-light-on-mint-container font-mono text-mono-sm tabular-nums">
                {momentumCard.delta}
              </span>
            </div>
            <svg className="w-full h-11 overflow-visible" viewBox="0 0 170 44" aria-hidden="true">
              <defs>
                <linearGradient id="splineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5220E5" />
                  <stop offset="100%" stopColor="#00885A" />
                </linearGradient>
                <linearGradient id="splineFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(82,32,229,0.22)" />
                  <stop offset="100%" stopColor="rgba(0,136,90,0)" />
                </linearGradient>
              </defs>
              <path
                d="M 2 36 C 32 34, 46 16, 76 22 C 106 28, 124 8, 162 6 L 162 42 L 2 42 Z"
                fill="url(#splineFill)"
              />
              <path
                d="M 2 36 C 32 34, 46 16, 76 22 C 106 28, 124 8, 162 6"
                fill="none"
                stroke="url(#splineStroke)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="162" cy="6" r="4.5" fill="#00885A" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
