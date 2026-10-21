import { useState } from 'react';
import { Button, Progress, Spinner, type Color } from '@design-token/react';

const colors: Color[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

export function ProgressShowcase() {
  const [value, setValue] = useState(40);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Progress · Value</div>
        <div className="showcase-stack">
          <Progress value={value} label="Upload progress" />
          <div className="frame-body">
            <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 20))}>
              −20
            </Button>
            <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 20))}>
              +20
            </Button>
            <span className="showcase-note">{value}%</span>
          </div>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Progress · Size, Color & Indeterminate</div>
        <div className="showcase-stack">
          <Progress value={60} size="sm" label="Small" />
          <Progress value={60} size="md" label="Medium" />
          <Progress value={60} size="lg" label="Large" />
          {colors.map((c, i) => (
            <Progress key={c} value={30 + i * 12} color={c} size="sm" label={c} />
          ))}
          <Progress label="Loading" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Spinner</div>
        <div className="frame-body">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          {colors.map((c) => (
            <Spinner key={c} color={c} />
          ))}
          <Button disabled>
            <Spinner size="sm" /> Saving…
          </Button>
        </div>
      </div>
    </>
  );
}
