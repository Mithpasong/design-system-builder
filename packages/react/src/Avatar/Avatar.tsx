import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Avatar.module.css';

const fallbackColors: Color[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

/** Stable color per name so the same person always gets the same fallback */
function colorFor(name: string): Color {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Used for alt text and the initials fallback */
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  /** Fallback background; derived from the name when omitted */
  color?: Color;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

export function Avatar({
  name,
  src,
  size = 'md',
  shape = 'circle',
  color,
  status,
  className,
  style,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span
      className={cx(styles.avatar, styles[size], styles[shape], className)}
      style={{ ...colorVars(color ?? colorFor(name)), ...style }}
      {...props}
    >
      {showImage ? (
        <img src={src} alt={name} className={styles.image} onError={() => setFailed(true)} />
      ) : (
        <span className={styles.initials} role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
      {status && <span className={cx(styles.status, styles[status])} aria-label={status} role="img" />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Show at most this many avatars, then a "+N" counter */
  max?: number;
  /** Size of the "+N" counter; match the avatars */
  size?: AvatarProps['size'];
  children: ReactNode[];
}

export function AvatarGroup({ max, size = 'md', className, children, ...props }: AvatarGroupProps) {
  const visible = max ? children.slice(0, max) : children;
  const rest = children.length - visible.length;

  return (
    <div className={cx(styles.group, className)} {...props}>
      {visible}
      {rest > 0 && <span className={cx(styles.avatar, styles[size], styles.circle, styles.more)}>+{rest}</span>}
    </div>
  );
}
