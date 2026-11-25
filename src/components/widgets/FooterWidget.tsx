import type { NavLinkItem } from '../../data/mockData';
import { MaterialIcon } from './MaterialIcon';

export interface FooterWidgetProps {
  brandName: string;
  copyright: string;
  links: NavLinkItem[];
}

export function FooterWidget({ brandName, copyright, links }: FooterWidgetProps) {
  return (
    <footer className="border-t border-light-outline-variant/40 bg-light-surface-container-lowest py-gutter-xl">
      <div className="max-w-[1120px] mx-auto px-page-margin flex flex-col sm:flex-row items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-7 h-7 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center">
            <MaterialIcon name="bolt" size={15} />
          </span>
          <span className="font-headline text-title-md text-light-on-surface">{brandName}</span>
          <span className="font-body text-body-sm text-light-on-surface-variant ml-gutter-sm">
            {copyright}
          </span>
        </div>
        <div className="flex items-center gap-gutter-lg">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-body-sm text-light-on-surface-variant hover:text-light-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
