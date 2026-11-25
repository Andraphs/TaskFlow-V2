import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { stitchMotion } from '../../tokens/designTokens';

export interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Disable scroll observer animation (useful when rendered inside Remotion frames) */
  immediate?: boolean;
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
  immediate = false,
}: RevealSectionProps) {
  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: stitchMotion.durations.reveal,
        delay,
        ease: stitchMotion.easeHeavyDecel,
      }}
    >
      {children}
    </motion.div>
  );
}
