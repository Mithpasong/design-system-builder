import { useState } from 'react';
import { ToastProvider } from '@design-token/react';
import {
  Focus,
  Layers,
  MoveHorizontal,
  Palette,
  Ruler,
  Square,
  SquareRoundCorner,
  Type,
  Wind,
  Download,
  type LucideIcon,
} from 'lucide-react';
import { ExportModal } from './export/ExportModal';
import { showcaseGroups, showcases } from './showcase/registry';
import { BorderSettingsModal } from './settings/BorderSettingsModal';
import { ColorSettingsModal } from './settings/ColorSettingsModal';
import { FocusRingSettingsModal } from './settings/FocusRingSettingsModal';
import { ModeToggle } from './settings/ModeToggle';
import { MotionSettingsModal } from './settings/MotionSettingsModal';
import { RadiusSettingsModal } from './settings/RadiusSettingsModal';
import { ResetAllButton } from './settings/ResetAllButton';
import { ShadowSettingsModal } from './settings/ShadowSettingsModal';
import { SizeSettingsModal } from './settings/SizeSettingsModal';
import { SpacingSettingsModal } from './settings/SpacingSettingsModal';
import { TextSettingsModal } from './settings/TextSettingsModal';
import { ThemeProvider } from './settings/ThemeContext';

type SettingsModalId =
  | 'color'
  | 'text'
  | 'size'
  | 'spacing'
  | 'radius'
  | 'border'
  | 'shadow'
  | 'motion'
  | 'focusRing';

const settingsMenu: { id: SettingsModalId; label: string; icon: LucideIcon }[] = [
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'size', label: 'Size', icon: Ruler },
  { id: 'spacing', label: 'Spacing', icon: MoveHorizontal },
  { id: 'radius', label: 'Radius', icon: SquareRoundCorner },
  { id: 'border', label: 'Border', icon: Square },
  { id: 'shadow', label: 'Shadow', icon: Layers },
  { id: 'motion', label: 'Motion', icon: Wind },
  { id: 'focusRing', label: 'Focus ring', icon: Focus },
];

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<SettingsModalId | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const selected = showcases.find((s) => s.id === selectedId);
  const Showcase = selected?.component;
  const closeModal = () => setOpenModal(null);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="layout">
          <aside className="sidebar">
            <div className="brand">Design System Builder</div>

            <nav className="menu">
              <div className="sidebar-mode">
                <ModeToggle />
              </div>

              <div className="menu-section">
                <div className="menu-heading">
                  Settings
                  <ResetAllButton />
                </div>
                {settingsMenu.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`menu-item${openModal === m.id ? ' is-active' : ''}`}
                    onClick={() => setOpenModal(m.id)}
                  >
                    <m.icon className="menu-icon" size={16} aria-hidden="true" />
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="menu-section">
                <div className="menu-heading">Components</div>
                {showcaseGroups.map((group) => (
                  <div key={group.title} className="menu-group">
                    <div className="menu-group-title">{group.title}</div>
                    {group.items.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`menu-item${s.id === selectedId ? ' is-active' : ''}`}
                        onClick={() => setSelectedId(s.id)}
                      >
                        <s.icon className="menu-icon" size={16} aria-hidden="true" />
                        {s.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </nav>

            <div className="sidebar-footer">
              <button type="button" className="export-button" onClick={() => setExportOpen(true)}>
                <Download size={16} aria-hidden="true" />
                Export
              </button>
            </div>
          </aside>

          <main className="canvas">
            {Showcase ? (
              <div className="canvas-content">
                <h1 className="canvas-title">{selected.label}</h1>
                <Showcase />
              </div>
            ) : (
              <div className="canvas-empty">Select a component from the menu</div>
            )}
          </main>
        </div>

        <ColorSettingsModal open={openModal === 'color'} onClose={closeModal} />
        <TextSettingsModal open={openModal === 'text'} onClose={closeModal} />
        <SizeSettingsModal open={openModal === 'size'} onClose={closeModal} />
        <SpacingSettingsModal open={openModal === 'spacing'} onClose={closeModal} />
        <RadiusSettingsModal open={openModal === 'radius'} onClose={closeModal} />
        <BorderSettingsModal open={openModal === 'border'} onClose={closeModal} />
        <ShadowSettingsModal open={openModal === 'shadow'} onClose={closeModal} />
        <MotionSettingsModal open={openModal === 'motion'} onClose={closeModal} />
        <FocusRingSettingsModal open={openModal === 'focusRing'} onClose={closeModal} />
        <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      </ToastProvider>
    </ThemeProvider>
  );
}
