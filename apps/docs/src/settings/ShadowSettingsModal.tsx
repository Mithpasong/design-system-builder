import { shadowLevels, type ShadowLevel } from '@design-token/tokens';
import { ColorField } from './ColorField';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

interface ShadowSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShadowSettingsModal({ open, onClose }: ShadowSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();
  const { shadow } = theme;

  const updateLevel = (level: ShadowLevel, patch: Partial<{ y: number; blur: number }>) =>
    setSection('shadow', {
      levels: { ...shadow.levels, [level]: { ...shadow.levels[level], ...patch } },
    });

  return (
    <Modal open={open} onClose={onClose} title="Shadow" onReset={() => resetSections('shadow')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Global</h3>
            <ColorField
              label="Color"
              description="Shadow tint"
              value={shadow.color}
              onChange={(color) => setSection('shadow', { color })}
            />
            <div className="token-row">
              <div className="color-row-text">
                <div className="color-row-label">Opacity</div>
                <div className="color-row-desc">Shared by every level</div>
              </div>
              <MiniSlider
                ariaLabel="Opacity"
                value={Math.round(shadow.opacity * 100)}
                min={0}
                max={40}
                unit="%"
                onChange={(v) => setSection('shadow', { opacity: v / 100 })}
              />
            </div>
          </section>

          <section className="settings-group">
            <h3 className="settings-group-title">Levels</h3>
            {shadowLevels.map((level) => (
              <div key={level} className="token-row">
                <code className="token-name">{level}</code>
                <MiniSlider
                  label="Y"
                  value={shadow.levels[level].y}
                  min={0}
                  max={32}
                  onChange={(y) => updateLevel(level, { y })}
                />
                <MiniSlider
                  label="Blur"
                  value={shadow.levels[level].blur}
                  min={0}
                  max={64}
                  onChange={(blur) => updateLevel(level, { blur })}
                />
              </div>
            ))}
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className="shadow-preview">
              {shadowLevels.map((level) => (
                <div key={level} className="shadow-card" style={{ boxShadow: `var(--dt-shadow-${level})` }}>
                  <code>{level}</code>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
