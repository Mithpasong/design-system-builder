import type { CSSProperties } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

/** Join class names, skipping falsy values */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Accent (--_c) and its foreground (--_fg) for a theme color, consumed by component CSS */
export function colorVars(color: Color): CSSProperties {
  return {
    '--_c': `var(--dt-${color})`,
    '--_fg': `var(--dt-${color}-foreground)`,
  } as CSSProperties;
}
