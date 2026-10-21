import { Button, Divider } from '@design-token/react';

export function DividerShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Horizontal</div>
        <div className="showcase-panel showcase-stack is-wide">
          <span>Section above</span>
          <Divider />
          <span>Section below</span>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">With label</div>
        <div className="showcase-panel showcase-stack is-wide">
          <Button>Continue with email</Button>
          <Divider label="OR" />
          <Button variant="outline">Continue with Google</Button>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Vertical</div>
        <div className="showcase-panel frame-body">
          <span>Home</span>
          <Divider orientation="vertical" />
          <span>Docs</span>
          <Divider orientation="vertical" />
          <span>Blog</span>
        </div>
      </div>
    </>
  );
}
