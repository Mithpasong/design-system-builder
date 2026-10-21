import type { HTMLAttributes, ReactNode } from 'react';
import { CloseIcon, StatusIcon } from '../icons';
import { colorVars, cx, type Color } from '../shared';
import styles from './Alert.module.css';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  color?: Color;
  variant?: 'soft' | 'outline' | 'solid';
  title?: ReactNode;
  /** Show the status icon */
  icon?: boolean;
  /** Shows a dismiss button when provided */
  onClose?: () => void;
}

export function Alert({
  color = 'info',
  variant = 'soft',
  title,
  icon = true,
  onClose,
  className,
  style,
  children,
  ...props
}: AlertProps) {
  // Errors and warnings interrupt screen readers; everything else is announced politely
  const role = color === 'danger' || color === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={cx(styles.alert, styles[variant], className)}
      style={{ ...colorVars(color), ...style }}
      {...props}
    >
      {icon && <StatusIcon color={color} className={styles.icon} />}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" className={styles.close} aria-label="Dismiss" onClick={onClose}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
