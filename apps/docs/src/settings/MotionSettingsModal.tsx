import { useState } from 'react';
import { motionDurations } from '@design-token/tokens';
import { MiniSlider } from './MiniSlider';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

const descriptions = {
  fast: 'Hover, press and small toggles',
  normal: 'Dropdowns, tooltips and tabs',
  slow: 'Modals, drawers and page transitions',
};

const easings = [
  { value: 'cubic-bezier(0.2, 0, 0, 1)', label: 'Standard' },
  { value: 'cubic-bezier(0, 0, 0.2, 1)', label: 'Ease out (enter)' },
  { value: 'cubic-bezier(0.4, 0, 1, 1)', label: 'Ease in (exit)' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Ease in-out' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring' },
  { value: 'linear', label: 'Linear' },
];

interface MotionSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function MotionSettingsModal({ open, onClose }: MotionSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();
  const { duration, easing } = theme.motion;
  const [moved, setMoved] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Motion" onReset={() => resetSections('motion')} size="wide">
      <div className="settings-columns is-split">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Duration</h3>
            {motionDurations.map((d) => (
              <div key={d} className="token-row">
                <code className="token-name is-wide">{d}</code>
                <div className="color-row-text">
                  <div className="color-row-desc">{descriptions[d]}</div>
                </div>
                <MiniSlider
                  ariaLabel={`${d} duration`}
                  value={duration[d]}
                  min={0}
                  max={1000}
                  step={10}
                  unit="ms"
                  onChange={(v) => setSection('motion', { duration: { ...duration, [d]: v } })}
                />
              </div>
            ))}
          </section>

          <section className="settings-group">
            <h3 className="settings-group-title">Easing</h3>
            <div className="token-row">
              <div className="color-row-text">
                <div className="color-row-label">Curve</div>
                <div className="color-row-desc">Shared by every duration</div>
              </div>
              <select
                className="setting-select"
                value={easing}
                aria-label="Easing curve"
                onChange={(e) => setSection('motion', { easing: e.target.value })}
              >
                {easings.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            <div className={`motion-preview${moved ? ' is-moved' : ''}`}>
              {motionDurations.map((d) => (
                <div key={d} className="motion-track">
                  <code className="token-name is-wide">{d}</code>
                  <div className="motion-lane">
                    <div
                      className="motion-dot"
                      style={{ transitionDuration: `var(--dt-duration-${d})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-row">
              <button type="button" className="modal-btn" onClick={() => setMoved((m) => !m)}>
                Play
              </button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
