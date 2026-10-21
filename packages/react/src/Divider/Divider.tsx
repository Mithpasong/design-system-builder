import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Text in the middle of a horizontal divider */
  label?: ReactNode;
}

export function Divider({ orientation = 'horizontal', label, className, ...props }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx(styles.divider, styles[orientation], Boolean(label) && styles.labeled, className)}
      {...props}
    >
      {label && orientation === 'horizontal' && <span className={styles.label}>{label}</span>}
    </div>
  );
}
