import { useState } from 'react';
import { Button, Stepper } from '@design-token/react';

const steps = [
  { label: 'Account', description: 'Email and password' },
  { label: 'Profile', description: 'Name and photo' },
  { label: 'Team', description: 'Invite members' },
  { label: 'Done', description: 'Start working' },
];

export function StepperShowcase() {
  const [current, setCurrent] = useState(1);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Horizontal</div>
        <div className="showcase-panel is-wide">
          <Stepper steps={steps} current={current} />
          <div className="frame-body" style={{ marginTop: 20 }}>
            <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
              Back
            </Button>
            <Button size="sm" disabled={current === steps.length} onClick={() => setCurrent((c) => c + 1)}>
              {current >= steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Vertical</div>
        <div className="showcase-panel">
          <Stepper steps={steps} current={current} orientation="vertical" />
        </div>
      </div>
    </>
  );
}
