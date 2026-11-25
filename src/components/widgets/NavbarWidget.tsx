import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { NavLinkItem } from '../../data/mockData';
import { stitchMotion } from '../../tokens/designTokens';
import { MaterialIcon } from './MaterialIcon';

export interface NavbarWidgetProps {
  brandName?: string;
  links: NavLinkItem[];
  onStartFree?: () => void;
}

export function NavbarWidget({
  brandName = 'TaskFlow',
  links,
  onStartFree,
}: NavbarWidgetProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 px-4 sm:px-page-margin pt-gutter-lg pb-gutter-sm">
      <nav
        id="landing-nav"
        aria-label="Primary navigation"
        className="max-w-[1120px] mx-auto bg-light-surface-container-lowest/90 backdrop-blur-md border border-light-outline-variant/50 rounded-full px-gutter-lg py-gutter-sm shadow-[0_8px_28px_-8px_rgba(11,28,48,0.08)] flex items-center justify-between gap-gutter-md sm:gap-gutter-lg transition-transform duration-200"
      >
        <a href="#top" className="flex items-center gap-gutter-sm shrink-0">
          <span className="w-9 h-9 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center">
            <MaterialIcon name="bolt" size={19} />
          </span>
          <span className="font-headline text-headline-md text-light-on-surface">
            {brandName}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-gutter-xl">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-label-lg text-light-on-surface-variant hover:text-light-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-gutter-sm shrink-0">
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center justify-center px-gutter-lg py-gutter-sm rounded-full bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant transition-colors active:scale-95"
          >
            <span className="font-body text-label-lg">View Plans</span>
          </a>

          {onStartFree ? (
            <button
              type="button"
              onClick={onStartFree}
              className="inline-flex items-center gap-gutter-xs justify-center px-gutter-lg py-gutter-sm rounded-full bg-light-secondary text-light-on-secondary hover:opacity-95 shadow-sm transition-transform duration-150 active:scale-95"
            >
              <span className="font-body text-label-lg">Start Free</span>
              <MaterialIcon name="arrow_forward" size={16} />
            </button>
          ) : (
            <a
              href="#cta"
              className="inline-flex items-center gap-gutter-xs justify-center px-gutter-lg py-gutter-sm rounded-full bg-light-secondary text-light-on-secondary hover:opacity-95 shadow-sm transition-transform duration-150 active:scale-95"
            >
              <span className="font-body text-label-lg">Start Free</span>
              <MaterialIcon name="arrow_forward" size={16} />
            </a>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-canvas text-light-on-surface hover:bg-light-surface-variant transition-colors active:scale-95"
          >
            <MaterialIcon name={mobileMenuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Navigation (390px friendly, >=44px tap targets) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: stitchMotion.easeHeavyDecel }}
            className="md:hidden max-w-[1120px] mx-auto mt-gutter-sm bg-light-surface-container-lowest/95 backdrop-blur-md border border-light-outline-variant/50 rounded-xl p-gutter-md shadow-[0_18px_40px_-14px_rgba(11,28,48,0.16)] flex flex-col gap-1"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] px-gutter-md rounded-lg flex items-center justify-between font-body text-label-lg text-light-on-surface hover:bg-neutral-canvas transition-colors"
              >
                <span>{link.label}</span>
                <MaterialIcon name="chevron_right" size={18} className="text-light-on-surface-variant" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
