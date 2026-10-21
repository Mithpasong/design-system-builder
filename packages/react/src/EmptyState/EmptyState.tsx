import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../shared';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration or icon shown in a tinted circle */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Usually one or two buttons */
  actions?: ReactNode;
  /** Draw a dashed border around the area */
  bordered?: boolean;
}

export function EmptyState({ icon, title, description, actions, bordered, className, ...props }: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, bordered && styles.bordered, className)} {...props}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
