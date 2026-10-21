import { Button } from '@design-token/react';
import { ColorField } from './ColorField';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

// Show the ring permanently in the preview instead of only on keyboard focus
const ringStyle = {
  outline: 'var(--dt-focus-ring-width) solid var(--dt-focus-ring-color)',
  outlineOffset: 'var(--dt-focus-ring-offset)',
};

interface FocusRingSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function FocusRingSettingsModal({ open, onClose }: FocusRingSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();
  const { color, width, offset } = theme.focusRing;

  return (
    <Modal open={open} onClose={onClose} title="Focus ring" onReset={() => resetSections('focusRing')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Ring</h3>
            <ColorField
              label="Color"
              description="Shown on keyboard focus"
              value={color}
              onChange={(v) => setSection('focusRing', { color: v })}
            />
            <div className="token-row">
              <div className="color-row-text">
                <div className="color-row-label">Width</div>
                <div className="color-row-desc">Ring thickness</div>
              </div>
              <MiniSlider
                ariaLabel="Focus ring width"
                value={width}
                min={1}
                max={6}
                onChange={(v) => setSection('focusRing', { width: v })}
              />
            </div>
            <div className="token-row">
              <div className="color-row-text">
                <div className="color-row-label">Offset</div>
                <div className="color-row-desc">Gap between element and ring</div>
              </div>
              <MiniSlider
                ariaLabel="Focus ring offset"
                value={offset}
                min={0}
                max={6}
                onChange={(v) => setSection('focusRing', { offset: v })}
              />
            </div>
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className="preview-row">
              <Button style={ringStyle}>Button</Button>
              <Button variant="outline" style={ringStyle}>
                Button
              </Button>
              <Button variant="soft" color="secondary" style={ringStyle}>
                Button
              </Button>
            </div>
            <p className="settings-hint">Press Tab to try the live ring:</p>
            <div className="preview-row">
              <Button>Button</Button>
              <Button variant="outline">Button</Button>
              <Button variant="soft" color="secondary">
                Button
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
