import type { CSSProperties } from 'react';

export interface MaterialIconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
  ariaHidden?: boolean;
}

export function MaterialIcon({
  name,
  size = 18,
  className = '',
  filled = false,
  ariaHidden = true,
}: MaterialIconProps) {
  const style: CSSProperties = {
    fontSize: `${size}px`,
    ...(filled ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" } : {}),
  };

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={style}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}
