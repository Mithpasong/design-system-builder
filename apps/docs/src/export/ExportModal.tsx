import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Braces, Download, FileCode, PenTool, type LucideIcon } from 'lucide-react';
import { useToast } from '@design-token/react';
import { Modal } from '../settings/Modal';
import { useTheme } from '../settings/ThemeContext';
import { buildCssZip, buildFigmaZip, type Themes } from './formats';
import { buildNpmPackage, packageSlug, validatePackageName, validateVersion } from './npmPackage';
import { createZip, downloadBlob } from './zip';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  files: string;
  filename: string;
  icon: LucideIcon;
  build: (themes: Themes) => Blob | Promise<Blob>;
}

const options: ExportOption[] = [
  {
    id: 'figma',
    title: 'Figma',
    description: 'Plugin that creates variables (Light / Dark), styles and every component, plus DTCG token files.',
    files: 'plugin/manifest.json · plugin/code.js · Light/Dark.tokens.json · README.md',
    filename: 'design-tokens-figma.zip',
    icon: PenTool,
    build: (themes) => createZip(buildFigmaZip(themes)),
  },
  {
    id: 'css',
    title: 'HTML, CSS',
    description: 'Token CSS variables (light / dark) plus every component as plain HTML and CSS.',
    files: 'tokens.css · components.css · components.html · index.html · README.md',
    filename: 'design-tokens-css.zip',
    icon: FileCode,
    build: async (themes) => {
      // The static renderer is only loaded when this export is used
      const { buildComponentEntries } = await import('./htmlExport');
      return createZip([...buildCssZip(themes), ...buildComponentEntries()]);
    },
  },
];

const NPM_FILES = 'package.json · tokens.json · tokens.css · components/ · components.css · index.js · index.d.ts · README.md';
const STORAGE_KEY = 'dt-export-npm';

/** Remember the last package name / version in this browser (convenience only) */
function loadPackageDefaults(): { name: string; version: string } {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (saved?.name && saved?.version) return saved;
  } catch {
    // Storage unavailable: fall back to defaults
  }
  return { name: '@your-scope/design-tokens', version: '1.0.0' };
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { themes } = useTheme();
  const { toast } = useToast();
  const [step, setStep] = useState<'choose' | 'npm'>('choose');
  const [pkg, setPkg] = useState(loadPackageDefaults);
  const [submitted, setSubmitted] = useState(false);

  // Always start from the option list when reopened
  useEffect(() => {
    if (open) {
      setStep('choose');
      setSubmitted(false);
    }
  }, [open]);

  const finish = (blob: Blob, filename: string) => {
    downloadBlob(blob, filename);
    onClose();
    toast({ title: `Downloaded ${filename}`, color: 'success', duration: 3000 });
  };

  const download = async (option: ExportOption) => finish(await option.build(themes), option.filename);

  const nameError = validatePackageName(pkg.name.trim());
  const versionError = validateVersion(pkg.version.trim());

  const downloadPackage = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || versionError) return;
    const options = { name: pkg.name.trim(), version: pkg.version.trim() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // Not remembering is fine
    }
    try {
      finish(createZip(buildNpmPackage(themes, options)), `${packageSlug(options.name)}-${options.version}.zip`);
    } catch (error) {
      toast({ title: 'Export failed', description: (error as Error).message, color: 'danger', duration: 0 });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Export" showModeToggle={false}>
      {step === 'choose' ? (
        <>
          <p className="export-intro">Exports include both light and dark mode with your current settings.</p>
          <div className="export-options">
            {options.map((o) => (
              <button key={o.id} type="button" className="export-option" onClick={() => download(o)}>
                <span className="export-option-icon">
                  <o.icon size={20} aria-hidden="true" />
                </span>
                <span className="export-option-text">
                  <span className="export-option-title">{o.title}</span>
                  <span className="export-option-desc">{o.description}</span>
                  <code className="export-option-files">{o.files}</code>
                </span>
                <Download className="export-option-download" size={18} aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="export-option" onClick={() => setStep('npm')}>
              <span className="export-option-icon">
                <Braces size={20} aria-hidden="true" />
              </span>
              <span className="export-option-text">
                <span className="export-option-title">JSON · npm package</span>
                <span className="export-option-desc">
                  Ready-to-publish npm package with your tokens and every React component: unzip, then npm publish.
                </span>
                <code className="export-option-files">{NPM_FILES}</code>
              </span>
              <Download className="export-option-download" size={18} aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <form className="export-npm" onSubmit={downloadPackage} noValidate>
          <button type="button" className="export-back" onClick={() => setStep('choose')}>
            <ArrowLeft size={14} aria-hidden="true" />
            Back
          </button>
          <p className="export-intro">
            Name the package you'll publish. Use a scope you own on npm (e.g. <code>@acme/design-tokens</code>) or an
            unused name.
          </p>

          <label className="export-field">
            <span className="export-field-label">Package name</span>
            <input
              className="export-input"
              value={pkg.name}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={submitted && !!nameError}
              onChange={(e) => setPkg((p) => ({ ...p, name: e.target.value }))}
            />
            {submitted && nameError && <span className="export-field-error">{nameError}</span>}
          </label>

          <label className="export-field">
            <span className="export-field-label">Version</span>
            <input
              className="export-input"
              value={pkg.version}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={submitted && !!versionError}
              onChange={(e) => setPkg((p) => ({ ...p, version: e.target.value }))}
            />
            {submitted && versionError ? (
              <span className="export-field-error">{versionError}</span>
            ) : (
              <span className="export-field-hint">Raise it every time you publish an update (1.0.0 → 1.1.0).</span>
            )}
          </label>

          <div className="export-npm-preview">
            <div className="export-field-label">After unzipping</div>
            <pre>{`cd ${packageSlug(pkg.name.trim() || 'design-tokens')}\nnpm login\nnpm publish --access public`}</pre>
          </div>

          <button type="submit" className="export-button">
            <Download size={16} aria-hidden="true" />
            Download package
          </button>
        </form>
      )}
    </Modal>
  );
}
