import type { SelectHTMLAttributes } from 'react';
import { cx, type Size } from '../shared';
import inputStyles from '../Input/Input.module.css';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  /** Disabled first option shown while nothing is selected */
  placeholder?: string;
  size?: Size;
  invalid?: boolean;
}

/** Native select styled like Input: keeps the platform picker and full keyboard / screen reader support */
export function Select({ options, placeholder, size = 'md', invalid, className, ...props }: SelectProps) {
  return (
    <span className={cx(styles.root, className)}>
      <select
        className={cx(inputStyles.field, inputStyles[`size-${size}`], invalid && inputStyles.invalid, styles.select)}
        aria-invalid={invalid || undefined}
        defaultValue={props.value === undefined && props.defaultValue === undefined && placeholder ? '' : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  );
}
