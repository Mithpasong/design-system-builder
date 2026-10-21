import type { InputHTMLAttributes, ReactNode } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Choice.module.css';

export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'color'> {
  /** Accent color when checked */
  color?: Color;
  /** Label text next to the control */
  children?: ReactNode;
}

/** Shared markup: a visually hidden native input followed by the drawn control */
function Choice({
  type,
  control,
  color = 'primary',
  className,
  style,
  children,
  ...props
}: ChoiceProps & { type: 'checkbox' | 'radio'; control: ReactNode }) {
  return (
    <label className={cx(styles.root, className)} style={{ ...colorVars(color), ...style }}>
      <input type={type} className={styles.input} {...props} />
      {control}
      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export function Checkbox(props: ChoiceProps) {
  return (
    <Choice
      {...props}
      type="checkbox"
      control={
        <span className={styles.box} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
      }
    />
  );
}

export function Radio(props: ChoiceProps) {
  return <Choice {...props} type="radio" control={<span className={cx(styles.box, styles.radio)} aria-hidden="true" />} />;
}

export function Switch(props: ChoiceProps) {
  return (
    <Choice
      {...props}
      type="checkbox"
      role="switch"
      control={<span className={styles.track} aria-hidden="true" />}
    />
  );
}
