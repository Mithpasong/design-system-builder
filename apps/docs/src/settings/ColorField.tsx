import { useEffect, useState } from 'react';

const HEX = /^#[0-9a-f]{6}$/i;

interface ColorFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, description, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleText = (next: string) => {
    setDraft(next);
    if (HEX.test(next)) onChange(next.toLowerCase());
  };

  return (
    <div className="color-row">
      <div className="color-row-text">
        <div className="color-row-label">{label}</div>
        <div className="color-row-desc">{description}</div>
      </div>
      <input
        type="color"
        className="color-swatch"
        value={value}
        aria-label={`${label} color`}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="color-hex"
        value={draft.toUpperCase()}
        maxLength={7}
        spellCheck={false}
        aria-label={`${label} hex value`}
        onChange={(e) => handleText(e.target.value)}
        onBlur={() => setDraft(value)}
      />
    </div>
  );
}
