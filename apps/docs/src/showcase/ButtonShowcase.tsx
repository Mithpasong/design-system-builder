import { Button, type ButtonColor } from '@design-token/react';

const colors: ButtonColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export function ButtonShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Variant</div>
        <div className="frame-body">
          <Button>Solid</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Size</div>
        <div className="frame-body">
          <Button size="xs">X-Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">X-Large</Button>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Color</div>
        <div className="frame-body">
          {colors.map((c) => (
            <Button key={c} color={c}>
              {capitalize(c)}
            </Button>
          ))}
        </div>
        <div className="frame-body">
          {colors.map((c) => (
            <Button key={c} color={c} variant="soft">
              {capitalize(c)}
            </Button>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">State</div>
        <div className="frame-body">
          <Button>Default</Button>
          <Button disabled>Solid</Button>
          <Button variant="soft" disabled>
            Soft
          </Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </div>
      </div>
    </>
  );
}
