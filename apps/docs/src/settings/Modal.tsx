import { useEffect, useId, useRef, type ReactNode } from 'react';
import { ModeToggle } from './ModeToggle';
import { useTheme } from './ThemeContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Shows "Reset {mode} to defaults" in the footer when provided */
  onReset?: () => void;
  /** Light / Dark switch in the header (settings modals edit one mode at a time) */
  showModeToggle?: boolean;
  size?: 'default' | 'wide' | 'xwide';
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  onReset,
  showModeToggle = true,
  size = 'default',
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mode } = useTheme();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal${size === 'default' ? '' : ` is-${size}`}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Close when the backdrop (the dialog element itself) is clicked
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <div className="modal-header-actions">
            {showModeToggle && <ModeToggle />}
            <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
              ×
            </button>
          </div>
        </header>

        <div className="modal-body">{children}</div>

        <footer className="modal-footer">
          {onReset ? (
            <button type="button" className="modal-btn" onClick={onReset}>
              Reset {mode} to defaults
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="modal-btn is-primary" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </dialog>
  );
}
