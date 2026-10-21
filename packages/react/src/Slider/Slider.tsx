import { useState, type CSSProperties, type InputHTMLAttributes } from 'react';
import { colorVars, cx, type Color } from '../shared';
import styles from './Slider.module.css';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'color' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: Color;
  /** Show the current value next to the track */
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

/** Native range input with a filled track; keyboard and screen readers work as usual */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'primary',
  showValue,
  formatValue = String,
  className,
  style,
  ...props
}: SliderProps) {
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const percent = max > min ? ((current - min) / (max - min)) * 100 : 0;

  return (
    <div
      className={cx(styles.root, className)}
      style={{ ...colorVars(color), '--_pct': `${percent}%`, ...style } as CSSProperties}
    >
      <input
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (value === undefined) setInner(next);
          onValueChange?.(next);
        }}
        {...props}
      />
      {showValue && <output className={styles.value}>{formatValue(current)}</output>}
    </div>
  );
}
