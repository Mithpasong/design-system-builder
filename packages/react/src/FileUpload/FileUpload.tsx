import { useId, useState, type DragEvent, type ReactNode } from 'react';
import { CloseIcon } from '../icons';
import { cx } from '../shared';
import styles from './FileUpload.module.css';

export interface FileUploadProps {
  /** Called with the full current list whenever files are added or removed */
  onFilesChange?: (files: File[]) => void;
  /** Same as the input's accept attribute, e.g. "image/*,.pdf" */
  accept?: string;
  multiple?: boolean;
  /** Max size per file in bytes; larger files are rejected */
  maxSize?: number;
  disabled?: boolean;
  /** Secondary line under the main prompt */
  hint?: ReactNode;
  /** id of the underlying file input (set by Field) */
  id?: string;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Click-or-drop area backed by a real file input, with a removable file list */
export function FileUpload({
  onFilesChange,
  accept,
  multiple = true,
  maxSize,
  disabled,
  hint,
  id,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const update = (next: File[]) => {
    setFiles(next);
    onFilesChange?.(next);
  };

  const add = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = maxSize ? incoming.filter((f) => f.size > maxSize) : [];
    const accepted = incoming.filter((f) => !tooBig.includes(f));
    setRejected(tooBig.map((f) => f.name));
    update(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) add(e.dataTransfer.files);
  };

  return (
    <div className={cx(styles.root, className)}>
      <label
        htmlFor={inputId}
        className={cx(styles.zone, dragging && styles.dragging, disabled && styles.disabled)}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </svg>
        <span className={styles.prompt}>
          <strong>Click to upload</strong> or drag and drop
        </span>
        {hint && <span className={styles.hint}>{hint}</span>}
        <input
          id={inputId}
          type="file"
          className={styles.input}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            add(e.target.files);
            // Allow selecting the same file again after removing it
            e.target.value = '';
          }}
        />
      </label>

      {rejected.length > 0 && (
        <p className={styles.error} role="alert">
          Too large: {rejected.join(', ')}
        </p>
      )}

      {files.length > 0 && (
        <ul className={styles.list}>
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className={styles.file}>
              <svg className={styles.fileIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V7z M14 3v4h4" />
              </svg>
              <span className={styles.name}>{file.name}</span>
              <span className={styles.size}>{formatSize(file.size)}</span>
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove ${file.name}`}
                onClick={() => update(files.filter((_, j) => j !== i))}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
