import { cloneElement, useId, type ReactElement, type ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Field.module.css';

export interface FieldProps {
  label: ReactNode;
  /** Help text under the control; replaced by `error` when present */
  hint?: ReactNode;
  /** Error message; also marks the control invalid */
  error?: ReactNode;
  required?: boolean;
  /** A single design-token control: Input, Textarea, Select, Combobox, DatePicker… */
  children: ReactElement;
  className?: string;
}

/** Label + control + hint / error, wired together with id, aria-describedby and invalid */
export function Field({ label, hint, error, required, children, className }: FieldProps) {
  const baseId = useId();
  const childProps = children.props as { id?: string; 'aria-describedby'?: string };
  const controlId = childProps.id ?? `${baseId}-control`;
  const messageId = `${baseId}-message`;
  const message = error ?? hint;

  const describedBy = [childProps['aria-describedby'], message && messageId].filter(Boolean).join(' ') || undefined;

  const control = cloneElement(children as ReactElement<Record<string, unknown>>, {
    id: controlId,
    'aria-describedby': describedBy,
    ...(error ? { invalid: true } : {}),
    ...(required ? { required: true } : {}),
  });

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={controlId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {control}
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  );
}
