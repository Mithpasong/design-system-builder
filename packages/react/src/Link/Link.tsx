import type { AnchorHTMLAttributes } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Link.module.css';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /** `inherit` uses the surrounding text color */
  color?: Color | 'inherit';
  underline?: 'hover' | 'always';
  /** Opens in a new tab and shows an arrow icon */
  external?: boolean;
}

export function Link({
  color = 'primary',
  underline = 'hover',
  external,
  className,
  style,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={cx(styles.link, styles[underline], color === 'inherit' && styles.inherit, className)}
      style={{ ...(color !== 'inherit' && colorVars(color)), ...style }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
      {external && (
        <svg className={styles.icon} viewBox="0 0 16 16" aria-label="(opens in a new tab)" role="img">
          <path d="M6 4h6v6M12 4l-7 7" />
        </svg>
      )}
    </a>
  );
}
