import { Tabs, type TabItem } from '@design-token/react';

const items: TabItem[] = [
  { value: 'overview', label: 'Overview', content: 'Overview of the project and its recent activity.' },
  { value: 'members', label: 'Members', content: 'People who can view and edit this project.' },
  { value: 'settings', label: 'Settings', content: 'Project name, visibility and integrations.' },
  { value: 'billing', label: 'Billing', content: 'Billing is managed by your organization.', disabled: true },
];

export function TabsShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Line</div>
        <div className="showcase-panel">
          <Tabs items={items} />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Pill</div>
        <div className="showcase-panel">
          <Tabs items={items} variant="pill" defaultValue="members" />
        </div>
      </div>
    </>
  );
}
