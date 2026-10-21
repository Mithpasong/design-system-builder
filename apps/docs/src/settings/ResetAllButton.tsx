import { RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function ResetAllButton() {
  const { resetAll } = useTheme();

  const handleClick = () => {
    if (!window.confirm('Reset all settings (light and dark) to defaults?')) return;
    resetAll();
  };

  return (
    <button
      type="button"
      className="menu-heading-action"
      aria-label="Reset all settings"
      title="Reset all settings"
      onClick={handleClick}
    >
      <RotateCcw size={12} aria-hidden="true" />
      Reset
    </button>
  );
}
