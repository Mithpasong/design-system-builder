import { renderToStaticMarkup } from 'react-dom/server';
import { Layers } from 'lucide-react';
import {
  Button,
  Combobox,
  DatePicker,
  DropdownMenu,
  Popover,
  Switch,
  ToastProvider,
  Tooltip,
} from '@design-token/react';
import { showcaseGroups, type ShowcaseEntry } from '../showcase/registry';
import docsCss from '../index.css?inline';
import type { ZipEntry } from './zip';

// Compiled component CSS (class names come from vite.config's generateScopedName: dt-{component}-{class})
const componentCssFiles = import.meta.glob('../../../../packages/react/src/**/*.module.css', {
  query: '?inline',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function buildComponentsCss(): string {
  const parts = Object.entries(componentCssFiles)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, css]) => {
      const name = path.split('/').pop()!.replace('.module.css', '');
      return `/* ---------- ${name} ---------- */\n${css.trim()}\n`;
    });
  return `/* Design System Builder components - requires tokens.css (the --dt-* variables)\n * Class names: dt-{component} and dt-{component}-{part}, e.g. dt-button dt-button-solid dt-button-size-md\n */\n\n${parts.join('\n')}`;
}

/** Overlays and menus open, which the live showcases only show after a click */
function OpenStatesShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Tooltip</div>
        <div className="frame-body is-roomy">
          {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
            <Tooltip key={p} content={`Tooltip on ${p}`} placement={p} open>
              <Button variant="outline">{p}</Button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="frame export-open-row">
        <div>
          <div className="frame-label">Dropdown menu</div>
          <DropdownMenu
            defaultOpen
            trigger={<Button variant="outline">Actions ▾</Button>}
            items={[
              { label: 'Edit', shortcut: 'Ctrl E' },
              { label: 'Duplicate', shortcut: 'Ctrl D' },
              { label: 'Archive', disabled: true },
              'separator',
              { label: 'Delete', danger: true },
            ]}
          />
        </div>
        <div>
          <div className="frame-label">Popover</div>
          <Popover defaultOpen trigger={<Button variant="outline">Notifications</Button>}>
            <div className="popover-demo">
              <strong>Notifications</strong>
              <Switch defaultChecked>Email</Switch>
              <Switch>Push</Switch>
              <Button size="sm">Done</Button>
            </div>
          </Popover>
        </div>
        <div style={{ width: 240 }}>
          <div className="frame-label">Combobox</div>
          <Combobox
            defaultOpen
            defaultValue="seoul"
            aria-label="City"
            options={[
              { value: 'seoul', label: 'Seoul', hint: 'KR' },
              { value: 'busan', label: 'Busan', hint: 'KR' },
              { value: 'tokyo', label: 'Tokyo', hint: 'JP' },
              { value: 'berlin', label: 'Berlin', hint: 'DE', disabled: true },
            ]}
          />
        </div>
        <div style={{ width: 240 }}>
          <div className="frame-label">Date picker</div>
          <DatePicker defaultOpen defaultValue={new Date()} aria-label="Date" />
        </div>
      </div>
    </>
  );
}

const exportGroups = [
  ...showcaseGroups,
  {
    title: 'Static previews',
    items: [{ id: 'open-states', label: 'Open states', icon: Layers, component: OpenStatesShowcase } as ShowcaseEntry],
  },
];

function ExportPage() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Design System Builder</div>
        <nav className="menu">
          <button type="button" className="export-theme-toggle" id="theme-toggle">
            Toggle dark mode
          </button>
          {exportGroups.map((group) => (
            <div key={group.title} className="menu-group">
              <div className="menu-group-title">{group.title}</div>
              {group.items.map((s) => (
                <a key={s.id} className="menu-item" href={`#${s.id}`}>
                  <s.icon className="menu-icon" size={16} aria-hidden="true" />
                  {s.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="canvas">
        <div className="canvas-content">
          {exportGroups.flatMap((group) =>
            group.items.map((s) => (
              <section key={s.id} id={s.id} className="export-section">
                <h1 className="canvas-title">{s.label}</h1>
                <s.component />
              </section>
            )),
          )}
        </div>
      </main>
    </div>
  );
}

/* Page-only rules: links in the sidebar, sections, and overlays shown inline instead of modal */
const EXPORT_CSS = `
html, body { height: auto; }
.layout { min-height: 100vh; align-items: flex-start; }
.sidebar { position: sticky; top: 0; height: 100vh; }
.canvas { overflow: visible; min-height: 100vh; }
a.menu-item { text-decoration: none; }
.export-section { padding-bottom: 48px; margin-bottom: 48px; border-bottom: 1px dashed var(--dt-border); scroll-margin-top: 24px; }
.export-theme-toggle { width: 100%; height: 36px; margin-bottom: 20px; border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg); font: inherit; font-weight: 600; color: var(--text); cursor: pointer; }
.export-open-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 48px; min-height: 420px; }
/* Dialogs and drawers are rendered open and inline so every state is visible on one page */
dialog[open] { position: relative !important; inset: auto !important; margin: 16px 0 !important; transform: none !important;
  animation: none !important; height: auto !important; max-height: none !important; }
`;

const THEME_SCRIPT = `
document.getElementById('theme-toggle').addEventListener('click', function () {
  var root = document.documentElement;
  var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
});
`;

export function buildComponentsHtml(): string {
  // Static markup; overlays are opened inline so they show up without JavaScript
  const body = renderToStaticMarkup(
    <ToastProvider>
      <ExportPage />
    </ToastProvider>,
  ).replace(/<dialog(?![^>]*\sopen)/g, '<dialog open');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Design System Builder components</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
    <link rel="stylesheet" href="tokens.css" />
    <link rel="stylesheet" href="components.css" />
    <style>
${docsCss}
${EXPORT_CSS}
    </style>
  </head>
  <body>
${body}
    <script>${THEME_SCRIPT}</script>
  </body>
</html>
`;
}

export function buildComponentEntries(): ZipEntry[] {
  return [
    { path: 'components.css', content: buildComponentsCss() },
    { path: 'components.html', content: buildComponentsHtml() },
  ];
}
