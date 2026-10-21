import { Button } from '@design-token/react';
import { borderWidths } from '@design-token/tokens';
import { ColorField } from './ColorField';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

const descriptions = {
  sm: 'Buttons, inputs, cards and dividers',
  md: 'Emphasis and selected states',
  lg: 'Focus rings and strong accents',
};

interface BorderSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function BorderSettingsModal({ open, onClose }: BorderSettingsModalProps) {
  const { theme, defaults, setColor, setSection, resetSections } = useTheme();

  const reset = () => {
    resetSections('border');
    setColor('neutral', 'border', defaults.neutral.border);
  };

  return (
    <Modal open={open} onClose={onClose} title="Border" onReset={reset} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Color</h3>
            <ColorField
              label="Color"
              description="Shared with Color → Neutral → Border"
              value={theme.neutral.border}
              onChange={(v) => setColor('neutral', 'border', v)}
            />
          </section>

          <section className="settings-group">
            <h3 className="settings-group-title">Width</h3>
            {borderWidths.map((w) => (
              <div key={w} className="token-row">
                <code className="token-name">{w}</code>
                <div className="color-row-text">
                  <div className="color-row-desc">{descriptions[w]}</div>
                </div>
                <MiniSlider
                  ariaLabel={`${w} border width`}
                  value={theme.border[w]}
                  min={0}
                  max={8}
                  onChange={(v) => setSection('border', { [w]: v })}
                />
              </div>
            ))}
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className="radius-preview">
              {borderWidths.map((w) => (
                <div key={w} className="radius-item">
                  <div
                    className="border-box"
                    style={{ borderWidth: `var(--dt-border-width-${w})` }}
                  />
                  <code>{w}</code>
                </div>
              ))}
            </div>
            <div className="preview-row">
              <Button variant="outline">Button</Button>
              <Button variant="outline" color="secondary">
                Button
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
