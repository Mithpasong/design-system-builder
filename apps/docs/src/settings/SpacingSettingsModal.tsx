import { getSpacingScale, spacingSteps, type SpacingStep } from '@design-token/tokens';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

interface SpacingSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SpacingSettingsModal({ open, onClose }: SpacingSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();
  const { base, multipliers } = theme.spacing;
  const scale = getSpacingScale(theme.spacing);

  const setMultiplier = (step: SpacingStep, value: number) =>
    setSection('spacing', { multipliers: { ...multipliers, [step]: value } });

  return (
    <Modal open={open} onClose={onClose} title="Spacing" onReset={() => resetSections('spacing')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Base unit</h3>
            <div className="token-row">
              <div className="color-row-text">
                <div className="color-row-label">Base</div>
                <div className="color-row-desc">Every step is a multiple of this</div>
              </div>
              <MiniSlider
                ariaLabel="Base unit"
                value={base}
                min={2}
                max={8}
                onChange={(v) => setSection('spacing', { base: v })}
              />
            </div>
          </section>

          <section className="settings-group">
            <h3 className="settings-group-title">Steps</h3>
            {scale.map(({ name, value }) => (
              <div key={name} className="token-row">
                <code className="token-name">{name}</code>
                <div className="color-row-text">
                  <div className="color-row-desc">{value}px</div>
                </div>
                <MiniSlider
                  ariaLabel={`${name} multiplier`}
                  value={multipliers[name]}
                  min={0}
                  max={24}
                  step={0.5}
                  unit="×"
                  onChange={(v) => setMultiplier(name, v)}
                />
              </div>
            ))}
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className="spacing-preview">
              {spacingSteps.map((step) => (
                <div key={step} className="spacing-row">
                  <code className="token-name">{step}</code>
                  <div className="spacing-bar" style={{ width: `var(--dt-space-${step})` }} />
                </div>
              ))}
            </div>
            <div className="spacing-stack" style={{ gap: 'var(--dt-space-md)', padding: 'var(--dt-space-lg)' }}>
              <div className="spacing-chip">gap: md</div>
              <div className="spacing-chip">padding: lg</div>
              <div className="spacing-chip">card</div>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
