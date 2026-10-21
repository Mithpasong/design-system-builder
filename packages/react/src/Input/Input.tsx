import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx, type Size } from '../shared';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  /** Error state: danger border and aria-invalid */
  invalid?: boolean;
}

export function Input({ size = 'md', invalid, className, ...props }: InputProps) {
  return (
    <input
      className={cx(styles.field, styles[`size-${size}`], invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      className={cx(styles.field, styles.textarea, invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      rows={rows}
      {...props}
    />
  );
}
