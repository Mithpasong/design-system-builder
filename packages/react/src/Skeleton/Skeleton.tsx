import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../shared';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** text only: number of lines; the last one is shorter */
  lines?: number;
}

/** Placeholder shape shown while content loads; hidden from assistive tech */
export function Skeleton({ variant = 'text', width, height, lines = 1, className, style, ...props }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cx(styles.lines, className)} style={{ width, ...style }} aria-hidden="true" {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cx(styles.skeleton, styles.text)} style={i === lines - 1 ? { width: '60%' } : undefined} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cx(styles.skeleton, styles[variant], className)}
      style={{ width, height: variant === 'circle' ? (height ?? width) : height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}
