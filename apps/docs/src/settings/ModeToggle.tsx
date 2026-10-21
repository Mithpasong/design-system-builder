import { Moon, Sun } from 'lucide-react';
import { themeModes } from '@design-token/tokens';
import { useTheme } from './ThemeContext';

const icons = { light: Sun, dark: Moon };
const labels = { light: 'Light', dark: 'Dark' };

/** Segmented Light / Dark switch; settings edit the selected mode */
export function ModeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Theme mode">
      {themeModes.map((m) => {
        const Icon = icons[m];
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            className={`mode-toggle-item${mode === m ? ' is-active' : ''}`}
            onClick={() => setMode(m)}
          >
            <Icon size={14} aria-hidden="true" />
            {labels[m]}
          </button>
        );
      })}
    </div>
  );
}
