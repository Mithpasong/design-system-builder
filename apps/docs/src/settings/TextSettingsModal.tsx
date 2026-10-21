import { fontWeights, getTypeScale, type FontWeight } from '@design-token/tokens';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

const ratios = [
  { value: 1.125, label: '1.125 · Major Second' },
  { value: 1.2, label: '1.2 · Minor Third' },
  { value: 1.25, label: '1.25 · Major Third' },
  { value: 1.333, label: '1.333 · Perfect Fourth' },
];

const weightOptions = [
  { value: 100, label: '100 · Thin' },
  { value: 200, label: '200 · ExtraLight' },
  { value: 300, label: '300 · Light' },
  { value: 400, label: '400 · Regular' },
  { value: 500, label: '500 · Medium' },
  { value: 600, label: '600 · SemiBold' },
  { value: 700, label: '700 · Bold' },
  { value: 800, label: '800 · ExtraBold' },
  { value: 900, label: '900 · Black' },
];

const weightDescriptions: Record<FontWeight, string> = {
  regular: 'Body text',
  medium: 'Labels and emphasis',
  semibold: 'Buttons and subheadings',
  bold: 'Headings',
};

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

interface TextSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TextSettingsModal({ open, onClose }: TextSettingsModalProps) {
  const { theme, setSection, resetSections } = useTheme();
  const setTypography = (patch: Partial<typeof theme.typography>) => setSection('typography', patch);
  const { baseSize, scaleRatio, weights } = theme.typography;
  const scale = getTypeScale(theme.typography);

  return (
    <Modal open={open} onClose={onClose} title="Text" onReset={() => resetSections('typography')} size="xwide">
      <div className="settings-columns is-text">
        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Size</h3>

            <div className="setting-row">
              <div className="color-row-text">
                <div className="color-row-label">Base size</div>
                <div className="color-row-desc">Size of md (body)</div>
              </div>
              <input
                type="range"
                className="setting-range"
                min={12}
                max={20}
                step={1}
                value={baseSize}
                aria-label="Base size"
                onChange={(e) => setTypography({ baseSize: Number(e.target.value) })}
              />
              <span className="setting-value">{baseSize}px</span>
            </div>

            <div className="setting-row">
              <div className="color-row-text">
                <div className="color-row-label">Scale ratio</div>
                <div className="color-row-desc">Step multiplier</div>
              </div>
              <select
                className="setting-select"
                value={scaleRatio}
                aria-label="Scale ratio"
                onChange={(e) => setTypography({ scaleRatio: Number(e.target.value) })}
              >
                {ratios.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="settings-group">
            <h3 className="settings-group-title">Weight</h3>
            {fontWeights.map((name) => (
              <div key={name} className="setting-row">
                <span className="weight-sample" style={{ fontWeight: weights[name] }}>
                  Ag
                </span>
                <div className="color-row-text">
                  <div className="color-row-label">{capitalize(name)}</div>
                  <div className="color-row-desc">{weightDescriptions[name]}</div>
                </div>
                <select
                  className="setting-select"
                  value={weights[name]}
                  aria-label={`${capitalize(name)} weight`}
                  onChange={(e) =>
                    setTypography({ weights: { ...weights, [name]: Number(e.target.value) } })
                  }
                >
                  {weightOptions.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </section>
        </div>

        <div className="settings-column">
          <section className="settings-group">
            <h3 className="settings-group-title">Preview</h3>
            {scale.map(({ name, fontSize, lineHeight }) => (
              <div key={name} className="type-row">
                <div className="type-meta">
                  <code className="type-name">{name}</code>
                  <span className="type-size">
                    {fontSize} / {lineHeight}
                  </span>
                </div>
                <div
                  className="type-sample"
                  style={{
                    fontSize,
                    lineHeight: `${lineHeight}px`,
                    // Large steps are headings, small steps are body text
                    fontWeight: fontSize > 20 ? weights.bold : weights.regular,
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </Modal>
  );
}
