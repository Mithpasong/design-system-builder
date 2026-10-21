import { Input, Textarea, type Size } from '@design-token/react';

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export function InputShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Size</div>
        <div className="showcase-stack">
          {sizes.map((s) => (
            <Input key={s} size={s} placeholder={`Size ${s}`} />
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">State</div>
        <div className="showcase-stack">
          <Input placeholder="Default" />
          <Input defaultValue="Filled value" />
          <Input invalid defaultValue="Invalid value" />
          <Input disabled placeholder="Disabled" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Textarea</div>
        <div className="showcase-stack">
          <Textarea placeholder="Write a message…" />
          <Textarea invalid defaultValue="Invalid message" rows={2} />
          <Textarea disabled placeholder="Disabled" rows={2} />
        </div>
      </div>
    </>
  );
}
