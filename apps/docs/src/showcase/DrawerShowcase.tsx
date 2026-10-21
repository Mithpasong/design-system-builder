import { useState } from 'react';
import { Button, Checkbox, Drawer, Field, Input, Select, Switch } from '@design-token/react';

type Open = 'right' | 'left' | 'bottom' | null;

export function DrawerShowcase() {
  const [open, setOpen] = useState<Open>(null);
  const close = () => setOpen(null);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Side</div>
        <div className="frame-body">
          <Button variant="outline" onClick={() => setOpen('right')}>
            Right (filters)
          </Button>
          <Button variant="outline" onClick={() => setOpen('left')}>
            Left (navigation)
          </Button>
          <Button variant="outline" onClick={() => setOpen('bottom')}>
            Bottom (sheet)
          </Button>
        </div>
      </div>

      <Drawer
        open={open === 'right'}
        onClose={close}
        title="Filters"
        description="Narrow down the member list"
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Reset
            </Button>
            <Button onClick={close}>Apply</Button>
          </>
        }
      >
        <Field label="Search">
          <Input placeholder="Name or email" />
        </Field>
        <Field label="Role">
          <Select
            options={[
              { value: 'all', label: 'All roles' },
              { value: 'design', label: 'Designer' },
              { value: 'dev', label: 'Developer' },
            ]}
            defaultValue="all"
          />
        </Field>
        <Checkbox defaultChecked>Active</Checkbox>
        <Checkbox>Invited</Checkbox>
        <Checkbox>Suspended</Checkbox>
      </Drawer>

      <Drawer open={open === 'left'} onClose={close} side="left" size="sm" title="Menu">
        {['Dashboard', 'Projects', 'Members', 'Settings'].map((item) => (
          <Button key={item} variant="ghost" onClick={close} style={{ justifyContent: 'flex-start' }}>
            {item}
          </Button>
        ))}
      </Drawer>

      <Drawer open={open === 'bottom'} onClose={close} side="bottom" size="sm" title="Quick settings">
        <Switch defaultChecked>Notifications</Switch>
        <Switch>Auto-save</Switch>
      </Drawer>
    </>
  );
}
