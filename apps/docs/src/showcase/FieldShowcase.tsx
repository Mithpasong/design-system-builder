import { Button, Combobox, DatePicker, Field, Input, Select, Textarea } from '@design-token/react';

const roles = [
  { value: 'design', label: 'Designer' },
  { value: 'dev', label: 'Developer' },
  { value: 'pm', label: 'Product manager' },
];

export function FieldShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Label, hint & error</div>
        <div className="showcase-stack">
          <Field label="Full name" hint="As shown on your ID" required>
            <Input placeholder="Kim Minji" />
          </Field>
          <Field label="Email" error="Enter a valid email address" required>
            <Input type="email" defaultValue="minji@" />
          </Field>
          <Field label="Bio" hint="Up to 200 characters">
            <Textarea rows={3} placeholder="Tell us about yourself" />
          </Field>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Works with every control</div>
        <div className="showcase-panel">
          <form className="showcase-form" onSubmit={(e) => e.preventDefault()}>
            <Field label="Role">
              <Select options={roles} placeholder="Choose a role" />
            </Field>
            <Field label="Team" hint="Type to search">
              <Combobox
                options={[
                  { value: 'core', label: 'Core platform' },
                  { value: 'growth', label: 'Growth' },
                  { value: 'ds', label: 'Design system' },
                ]}
                placeholder="Search teams"
              />
            </Field>
            <Field label="Start date" error="Pick a date">
              <DatePicker />
            </Field>
            <div className="showcase-form-actions">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
