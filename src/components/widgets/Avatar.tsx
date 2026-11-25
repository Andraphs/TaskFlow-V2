import { useState } from 'react';

export interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function Avatar({ src, alt, className = 'w-10 h-10' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex items-center justify-center rounded-full bg-light-secondary-container text-light-on-secondary-container font-headline text-label-sm select-none shrink-0 ${className}`}
      >
        {getInitials(alt)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
}
