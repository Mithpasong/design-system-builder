interface MiniSliderProps {
  label?: string;
  /** Accessible name when there is no visible label */
  ariaLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

/** Compact labeled range input; several fit in one settings row */
export function MiniSlider({
  label,
  ariaLabel,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
}: MiniSliderProps) {
  return (
    <label className="mini-slider">
      {label && <span className="mini-slider-label">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="mini-slider-value">
        {value}
        {unit}
      </span>
    </label>
  );
}
