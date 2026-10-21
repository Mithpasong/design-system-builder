import type { HTMLAttributes } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Progress.module.css';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** 0-100; omit for an indeterminate bar */
  value?: number;
  color?: Color;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name, e.g. "Uploading file" */
  label?: string;
}

export function Progress({ value, color = 'primary', size = 'md', label, className, style, ...props }: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cx(styles.track, styles[size], indeterminate && styles.indeterminate, className)}
      style={{ ...colorVars(color), ...style }}
      {...props}
    >
      <div className={styles.bar} style={indeterminate ? undefined : { width: `${clamped}%` }} />
    </div>
  );
}

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  size?: 'sm' | 'md' | 'lg';
  /** Defaults to the current text color */
  color?: Color;
  label?: string;
}

export function Spinner({ size = 'md', color, label = 'Loading', className, style, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(styles.spinner, styles[`spinner-${size}`], color && styles.colored, className)}
      style={{ ...(color && colorVars(color)), ...style }}
      {...props}
    />
  );
}
