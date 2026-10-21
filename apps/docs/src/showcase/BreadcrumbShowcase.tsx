import { Breadcrumb } from '@design-token/react';

const prevent = (e: React.MouseEvent) => e.preventDefault();

const items = [
  { label: 'Home', href: '#', onClick: prevent },
  { label: 'Projects', href: '#', onClick: prevent },
  { label: 'Design tokens', href: '#', onClick: prevent },
  { label: 'Settings' },
];

export function BreadcrumbShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Chevron</div>
        <Breadcrumb items={items} />
      </div>

      <div className="frame">
        <div className="frame-label">Slash</div>
        <Breadcrumb items={items} separator="slash" />
      </div>
    </>
  );
}
