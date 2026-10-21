export interface Typography {
  /** Font size of the `md` step in px */
  baseSize: number;
  /** Multiplier between neighboring steps (modular scale) */
  scaleRatio: number;
  /** Numeric font weights (100-900) */
  weights: Record<FontWeight, number>;
}

export const fontWeights = ['regular', 'medium', 'semibold', 'bold'] as const;

export type FontWeight = (typeof fontWeights)[number];

export const componentSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type ComponentSize = (typeof componentSizes)[number];

export interface SizeToken {
  height: number;
  paddingX: number;
}

export const radii = ['sm', 'md', 'lg'] as const;

export type Radius = (typeof radii)[number];

export const borderWidths = ['sm', 'md', 'lg'] as const;

export type BorderWidth = (typeof borderWidths)[number];

export const shadowLevels = ['sm', 'md', 'lg', 'xl'] as const;

export type ShadowLevel = (typeof shadowLevels)[number];

export interface ShadowTheme {
  color: string;
  /** 0-1, shared by every level */
  opacity: number;
  levels: Record<ShadowLevel, { y: number; blur: number }>;
}

export const spacingSteps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

export type SpacingStep = (typeof spacingSteps)[number];

export interface SpacingTheme {
  /** Base unit in px; every step is a multiple of it */
  base: number;
  multipliers: Record<SpacingStep, number>;
}

export const motionDurations = ['fast', 'normal', 'slow'] as const;

export type MotionDuration = (typeof motionDurations)[number];

export interface MotionTheme {
  /** Durations in ms */
  duration: Record<MotionDuration, number>;
  /** CSS easing function shared by every duration */
  easing: string;
}

export interface FocusRingTheme {
  color: string;
  width: number;
  /** Gap between the element and the ring in px */
  offset: number;
}

export const themeModes = ['light', 'dark'] as const;

export type ThemeMode = (typeof themeModes)[number];

export interface Theme {
  brand: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  neutral: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
  };
  typography: Typography;
  size: Record<ComponentSize, SizeToken>;
  radius: Record<Radius, number>;
  border: Record<BorderWidth, number>;
  shadow: ShadowTheme;
  spacing: SpacingTheme;
  motion: MotionTheme;
  focusRing: FocusRingTheme;
}

export type ColorGroup = 'brand' | 'status' | 'neutral';

export const defaultTheme: Theme = {
  brand: {
    primary: '#000000',
    secondary: '#7c3aed',
  },
  status: {
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#dc2626',
    info: '#0284c7',
  },
  neutral: {
    background: '#f4f4f5',
    surface: '#ffffff',
    border: '#e4e4e7',
    text: '#18181b',
    textMuted: '#71717a',
  },
  typography: {
    baseSize: 14,
    scaleRatio: 1.2,
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  size: {
    xs: { height: 24, paddingX: 8 },
    sm: { height: 32, paddingX: 12 },
    md: { height: 40, paddingX: 16 },
    lg: { height: 48, paddingX: 20 },
    xl: { height: 56, paddingX: 24 },
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  border: {
    sm: 1,
    md: 2,
    lg: 4,
  },
  shadow: {
    color: '#000000',
    opacity: 0.12,
    levels: {
      sm: { y: 1, blur: 2 },
      md: { y: 4, blur: 8 },
      lg: { y: 8, blur: 24 },
      xl: { y: 16, blur: 48 },
    },
  },
  spacing: {
    base: 4,
    multipliers: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6, '2xl': 8, '3xl': 12 },
  },
  motion: {
    duration: { fast: 100, normal: 200, slow: 300 },
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  focusRing: {
    color: '#3b82f6',
    width: 2,
    offset: 2,
  },
};

/** Defaults per mode; every section can be tuned separately for light and dark */
export const defaultThemes: Record<ThemeMode, Theme> = {
  light: defaultTheme,
  dark: {
    ...defaultTheme,
    brand: {
      primary: '#ffffff',
      secondary: '#a78bfa',
    },
    status: {
      success: '#22c55e',
      warning: '#fbbf24',
      danger: '#ef4444',
      info: '#38bdf8',
    },
    neutral: {
      background: '#09090b',
      surface: '#18181b',
      border: '#27272a',
      text: '#fafafa',
      textMuted: '#a1a1aa',
    },
    shadow: { ...defaultTheme.shadow, opacity: 0.4 },
    focusRing: { ...defaultTheme.focusRing, color: '#60a5fa' },
  },
};

/* ---------- color ---------- */

/** Convert a #rgb / #rrggbb string to [r, g, b] (0-255) */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WCAG relative luminance */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Text color for a given background (black or white, whichever has more contrast) */
export function getForeground(background: string): string {
  return luminance(background) > 0.179 ? '#000000' : '#ffffff';
}

/* ---------- typography ---------- */

export const textSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;

export type TextSize = (typeof textSizes)[number];

export interface TextStyle {
  name: TextSize;
  fontSize: number;
  lineHeight: number;
}

/** Build the type scale: md = baseSize, each step up/down multiplies/divides by scaleRatio */
export function getTypeScale({ baseSize, scaleRatio }: Typography): TextStyle[] {
  const mdIndex = textSizes.indexOf('md');
  return textSizes.map((name, i) => {
    const fontSize = Math.round(baseSize * scaleRatio ** (i - mdIndex));
    // Body text needs more leading than large headings
    const lineHeight = Math.round(fontSize * (fontSize <= 20 ? 1.5 : 1.25));
    return { name, fontSize, lineHeight };
  });
}

/* ---------- shadow ---------- */

/** CSS box-shadow value for a level */
export function getShadow({ color, opacity, levels }: ShadowTheme, level: ShadowLevel): string {
  const [r, g, b] = hexToRgb(color);
  const { y, blur } = levels[level];
  return `0 ${y}px ${blur}px rgb(${r} ${g} ${b} / ${opacity})`;
}

/* ---------- spacing ---------- */

/** Spacing scale in px: base unit x each step's multiplier */
export function getSpacingScale({ base, multipliers }: SpacingTheme): { name: SpacingStep; value: number }[] {
  return spacingSteps.map((name) => ({ name, value: Math.round(base * multipliers[name]) }));
}

/* ---------- apply ---------- */

/** camelCase -> kebab-case (textMuted -> text-muted) */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

/**
 * Every theme value as a CSS custom property (temporary: to be replaced by the color scale engine)
 *
 * brand / status -> --dt-{name}, --dt-{name}-foreground
 * neutral        -> --dt-{name}
 * typography     -> --dt-font-size-{size}, --dt-line-height-{size}, --dt-font-weight-{name}
 * size           -> --dt-size-{size}-height, --dt-size-{size}-padding-x
 * radius         -> --dt-radius-{size}, --dt-radius-full
 * border         -> --dt-border-width-{size}
 * shadow         -> --dt-shadow-{level}
 * spacing        -> --dt-space-{step}
 * motion         -> --dt-duration-{name}, --dt-easing
 * focusRing      -> --dt-focus-ring-color, --dt-focus-ring-width, --dt-focus-ring-offset
 */
export function getCssVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  const accents = { ...theme.brand, ...theme.status };
  for (const [name, color] of Object.entries(accents)) {
    vars[`--dt-${name}`] = color;
    vars[`--dt-${name}-foreground`] = getForeground(color);
  }
  for (const [name, color] of Object.entries(theme.neutral)) {
    vars[`--dt-${toKebab(name)}`] = color;
  }
  for (const { name, fontSize, lineHeight } of getTypeScale(theme.typography)) {
    vars[`--dt-font-size-${name}`] = `${fontSize}px`;
    vars[`--dt-line-height-${name}`] = `${lineHeight}px`;
  }
  for (const [name, weight] of Object.entries(theme.typography.weights)) {
    vars[`--dt-font-weight-${name}`] = String(weight);
  }
  for (const [name, { height, paddingX }] of Object.entries(theme.size)) {
    vars[`--dt-size-${name}-height`] = `${height}px`;
    vars[`--dt-size-${name}-padding-x`] = `${paddingX}px`;
  }
  for (const [name, radius] of Object.entries(theme.radius)) {
    vars[`--dt-radius-${name}`] = `${radius}px`;
  }
  vars['--dt-radius-full'] = '9999px';
  for (const [name, width] of Object.entries(theme.border)) {
    vars[`--dt-border-width-${name}`] = `${width}px`;
  }
  for (const level of shadowLevels) {
    vars[`--dt-shadow-${level}`] = getShadow(theme.shadow, level);
  }
  for (const { name, value } of getSpacingScale(theme.spacing)) {
    vars[`--dt-space-${name}`] = `${value}px`;
  }
  for (const [name, ms] of Object.entries(theme.motion.duration)) {
    vars[`--dt-duration-${name}`] = `${ms}ms`;
  }
  vars['--dt-easing'] = theme.motion.easing;
  vars['--dt-focus-ring-color'] = theme.focusRing.color;
  vars['--dt-focus-ring-width'] = `${theme.focusRing.width}px`;
  vars['--dt-focus-ring-offset'] = `${theme.focusRing.offset}px`;
  return vars;
}

/** Apply the theme as CSS variables on an element (the document root by default) */
export function applyTheme(theme: Theme, target: HTMLElement = document.documentElement): void {
  for (const [name, value] of Object.entries(getCssVariables(theme))) {
    target.style.setProperty(name, value);
  }
}
