import type { HTMLAttributes, ReactNode } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Badge.module.css';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  variant?: 'solid' | 'soft' | 'outline';
  color?: Color;
  size?: 'sm' | 'md';
  /** Fully rounded ends */
  pill?: boolean;
}

export function Badge({
  variant = 'soft',
  color = 'primary',
  size = 'md',
  pill,
  className,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[size], styles[variant], pill && styles.pill, className)}
      style={{ ...colorVars(color), ...style }}
      {...props}
    />
  );
}

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Tinted tag; neutral when omitted */
  color?: Color;
  /** Shows a remove button when provided */
  onRemove?: () => void;
  children: ReactNode;
}

export function Tag({ color, onRemove, className, style, children, ...props }: TagProps) {
  return (
    <span
      className={cx(styles.badge, styles.md, styles.tag, color ? styles.soft : styles.neutral, className)}
      style={{ ...(color && colorVars(color)), ...style }}
      {...props}
    >
      {children}
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={typeof children === 'string' ? `Remove ${children}` : 'Remove'} onClick={onRemove}>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </span>
  );
}
