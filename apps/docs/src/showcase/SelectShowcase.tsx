import { Button, DropdownMenu, Select, useToast, type Size } from '@design-token/react';

const sizes: Size[] = ['sm', 'md', 'lg'];

const countries = [
  { value: 'kr', label: 'South Korea' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany', disabled: true },
];

export function SelectShowcase() {
  const { toast } = useToast();
  const notify = (title: string) => () => toast({ title, duration: 2000 });

  return (
    <>
      <div className="frame">
        <div className="frame-label">Select · Size</div>
        <div className="showcase-stack">
          {sizes.map((s) => (
            <Select key={s} size={s} options={countries} placeholder={`Country (${s})`} aria-label="Country" />
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Select · State</div>
        <div className="showcase-stack">
          <Select options={countries} defaultValue="kr" aria-label="Country" />
          <Select options={countries} placeholder="Invalid" invalid aria-label="Country" />
          <Select options={countries} placeholder="Disabled" disabled aria-label="Country" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Dropdown menu</div>
        <div className="frame-body">
          <DropdownMenu
            trigger={<Button variant="outline">Actions ▾</Button>}
            items={[
              { label: 'Edit', shortcut: 'Ctrl E', onSelect: notify('Edit') },
              { label: 'Duplicate', shortcut: 'Ctrl D', onSelect: notify('Duplicate') },
              { label: 'Archive', disabled: true },
              'separator',
              { label: 'Delete', danger: true, onSelect: notify('Delete') },
            ]}
          />
          <DropdownMenu
            align="end"
            trigger={<Button variant="ghost">More ⋯</Button>}
            items={[
              { label: 'Share', onSelect: notify('Share') },
              { label: 'Download', onSelect: notify('Download') },
            ]}
          />
        </div>
      </div>
    </>
  );
}
