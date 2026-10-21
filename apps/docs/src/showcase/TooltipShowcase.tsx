import { Button, Input, Popover, Switch, Tooltip, type Placement } from '@design-token/react';

const placements: Placement[] = ['top', 'right', 'bottom', 'left'];

export function TooltipShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Tooltip · Placement</div>
        <div className="frame-body is-roomy">
          {placements.map((p) => (
            <Tooltip key={p} content={`Tooltip on ${p}`} placement={p}>
              <Button variant="outline">{p[0].toUpperCase() + p.slice(1)}</Button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Popover</div>
        <div className="frame-body is-roomy">
          <Popover trigger={<Button variant="outline">Notifications</Button>}>
            {(close) => (
              <div className="popover-demo">
                <strong>Notifications</strong>
                <Switch defaultChecked>Email</Switch>
                <Switch>Push</Switch>
                <Button size="sm" onClick={close}>
                  Done
                </Button>
              </div>
            )}
          </Popover>

          <Popover trigger={<Button>Rename</Button>} align="center">
            {(close) => (
              <div className="popover-demo">
                <Input size="sm" defaultValue="Untitled project" aria-label="Project name" />
                <div className="popover-actions">
                  <Button size="sm" variant="ghost" onClick={close}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={close}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Popover>
        </div>
      </div>
    </>
  );
}
