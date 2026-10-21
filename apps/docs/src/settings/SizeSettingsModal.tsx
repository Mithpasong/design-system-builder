import { Button } from '@design-token/react';
import { componentSizes, type ComponentSize, type SizeToken } from '@design-token/tokens';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

interface SizeSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SizeSettingsModal({ open, onClose }: SizeSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();

  const update = (size: ComponentSize, patch: Partial<SizeToken>) =>
    setSection('size', { [size]: { ...theme.size[size], ...patch } });

  return (
    <Modal open={open} onClose={onClose} title="Size" onReset={() => resetSections('size')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Height & Padding</h3>
            {componentSizes.map((size) => (
              <div key={size} className="token-row">
                <code className="token-name">{size}</code>
                <MiniSlider
                  label="Height"
                  value={theme.size[size].height}
                  min={24}
                  max={64}
                  onChange={(height) => update(size, { height })}
                />
                <MiniSlider
                  label="Padding"
                  value={theme.size[size].paddingX}
                  min={4}
                  max={40}
                  onChange={(paddingX) => update(size, { paddingX })}
                />
              </div>
            ))}
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            {componentSizes.map((size) => (
              <div key={size} className="preview-row">
                <code className="token-name">{size}</code>
                <Button size={size}>Button</Button>
                <Button size={size} variant="outline">
                  Button
                </Button>
              </div>
            ))}
          </section>
        </div>
      </div>
    </Modal>
  );
}
