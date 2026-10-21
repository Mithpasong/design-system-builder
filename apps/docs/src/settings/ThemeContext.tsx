import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { applyTheme, defaultThemes, type ColorGroup, type Theme, type ThemeMode } from '@design-token/tokens';

interface ThemeContextValue {
  /** Mode being previewed and edited */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Theme of the current mode */
  theme: Theme;
  /** Themes of every mode (for export) */
  themes: Record<ThemeMode, Theme>;
  /** Defaults of the current mode */
  defaults: Theme;
  setColor: (group: ColorGroup, key: string, value: string) => void;
  /** Shallow-merge a patch into one theme section of the current mode */
  setSection: <K extends keyof Theme>(key: K, patch: Partial<Theme[K]>) => void;
  /** Restore the given sections of the current mode to their defaults */
  resetSections: (...keys: (keyof Theme)[]) => void;
  /** Restore every section of every mode */
  resetAll: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<Record<ThemeMode, Theme>>(defaultThemes);
  const [mode, setMode] = useState<ThemeMode>('light');
  const theme = themes[mode];
  const defaults = defaultThemes[mode];

  useEffect(() => {
    applyTheme(theme);
    document.documentElement.dataset.theme = mode;
  }, [theme, mode]);

  /** Update only the current mode's theme */
  const update = (fn: (t: Theme) => Theme) => setThemes((all) => ({ ...all, [mode]: fn(all[mode]) }));

  const setColor = (group: ColorGroup, key: string, value: string) =>
    update((t) => ({ ...t, [group]: { ...t[group], [key]: value } }));

  const setSection = <K extends keyof Theme>(key: K, patch: Partial<Theme[K]>) =>
    update((t) => ({ ...t, [key]: { ...t[key], ...patch } }));

  const resetSections = (...keys: (keyof Theme)[]) =>
    update((t) => {
      const next = { ...t };
      for (const key of keys) Object.assign(next, { [key]: defaults[key] });
      return next;
    });

  const resetAll = () => setThemes(defaultThemes);

  return (
    <ThemeContext.Provider
      value={{ mode, setMode, theme, themes, defaults, setColor, setSection, resetSections, resetAll }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
