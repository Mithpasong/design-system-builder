import { useState } from 'react';
import { Field, Slider, type Color } from '@design-token/react';

const colors: Color[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

export function SliderShowcase() {
  const [volume, setVolume] = useState(60);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Basic</div>
        <div className="showcase-stack">
          <Slider defaultValue={40} aria-label="Basic slider" />
          <Field label="Volume" hint={volume === 0 ? 'Muted' : undefined}>
            <Slider value={volume} onValueChange={setVolume} showValue formatValue={(v) => `${v}%`} />
          </Field>
          <Field label="Price">
            <Slider defaultValue={250} min={0} max={1000} step={50} showValue formatValue={(v) => `$${v}`} />
          </Field>
          <Slider defaultValue={30} disabled aria-label="Disabled slider" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Color</div>
        <div className="showcase-stack">
          {colors.map((c, i) => (
            <Slider key={c} color={c} defaultValue={20 + i * 12} aria-label={c} />
          ))}
        </div>
      </div>
    </>
  );
}
