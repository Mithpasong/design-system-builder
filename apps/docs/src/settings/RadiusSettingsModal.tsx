import { Button } from '@design-token/react';
import { radii } from '@design-token/tokens';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

const descriptions = {
  sm: 'Badges, checkboxes, small chips',
  md: 'Buttons and inputs',
  lg: 'Cards, modals and popovers',
};

interface RadiusSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function RadiusSettingsModal({ open, onClose }: RadiusSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();

  return (
    <Modal open={open} onClose={onClose} title="Radius" onReset={() => resetSections('radius')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Radius</h3>
            {radii.map((r) => (
              <div key={r} className="token-row">
                <code className="token-name">{r}</code>
                <div className="color-row-text">
                  <div className="color-row-desc">{descriptions[r]}</div>
                </div>
                <MiniSlider
                  ariaLabel={`${r} radius`}
                  value={theme.radius[r]}
                  min={0}
                  max={32}
                  onChange={(v) => setSection('radius', { [r]: v })}
                />
              </div>
            ))}
            <div className="token-row">
              <code className="token-name">full</code>
              <div className="color-row-text">
                <div className="color-row-desc">Pills and avatars (fixed: 9999px)</div>
              </div>
            </div>
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className="radius-preview">
              {[...radii, 'full' as const].map((r) => (
                <div key={r} className="radius-item">
                  <div className="radius-box" style={{ borderRadius: `var(--dt-radius-${r})` }} />
                  <code>{r}</code>
                </div>
              ))}
            </div>
            <div className="preview-row">
              <Button>Button</Button>
              <Button variant="outline">Button</Button>
              <Button variant="soft">Button</Button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
