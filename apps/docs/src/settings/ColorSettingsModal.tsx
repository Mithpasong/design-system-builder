import type { ColorGroup } from '@design-token/tokens';
import { ColorField } from './ColorField';
import { Modal } from './Modal';
import { useTheme } from './ThemeContext';

interface FieldDef {
  key: string;
  label: string;
  description: string;
}

const groups: { group: ColorGroup; title: string; fields: FieldDef[] }[] = [
  {
    group: 'brand',
    title: 'Brand',
    fields: [
      { key: 'primary', label: 'Primary', description: 'Main actions, links and selected states' },
      { key: 'secondary', label: 'Secondary', description: 'Supporting accents and secondary actions' },
    ],
  },
  {
    group: 'status',
    title: 'Status',
    fields: [
      { key: 'success', label: 'Success', description: 'Confirmations and completed actions' },
      { key: 'warning', label: 'Warning', description: 'Cautions that need attention' },
      { key: 'danger', label: 'Danger', description: 'Destructive actions and errors' },
      { key: 'info', label: 'Info', description: 'Notices and help messages' },
    ],
  },
  {
    group: 'neutral',
    title: 'Neutral',
    fields: [
      { key: 'background', label: 'Background', description: 'Page background' },
      { key: 'surface', label: 'Surface', description: 'Cards, modals and menus' },
      { key: 'border', label: 'Border', description: 'Borders and dividers' },
      { key: 'text', label: 'Text', description: 'Body text' },
      { key: 'textMuted', label: 'Text Muted', description: 'Secondary text and placeholders' },
    ],
  },
];

// Two columns so every field fits without scrolling: Brand + Status | Neutral
const columns = [groups.slice(0, 2), groups.slice(2)];

interface ColorSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ColorSettingsModal({ open, onClose }: ColorSettingsModalProps) {
  const { theme, setColor, resetSections } = useTheme();

  return (
    <Modal open={open} onClose={onClose} title="Color" onReset={() => resetSections('brand', 'status', 'neutral')} size="wide">
      <div className="settings-columns">
        {columns.map((column, i) => (
          <div key={i} className="settings-column">
            {column.map(({ group, title, fields }) => (
              <section key={group} className="settings-group">
                <h3 className="settings-group-title">{title}</h3>
                {fields.map((f) => (
                  <ColorField
                    key={f.key}
                    label={f.label}
                    description={f.description}
                    value={(theme[group] as Record<string, string>)[f.key]}
                    onChange={(v) => setColor(group, f.key, v)}
                  />
                ))}
              </section>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
