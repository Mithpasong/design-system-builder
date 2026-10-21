import { useState } from 'react';
import { Alert, Button, useToast, type Color } from '@design-token/react';

const statuses: { color: Color; title: string; body: string }[] = [
  { color: 'info', title: 'Update available', body: 'A new version is ready to install.' },
  { color: 'success', title: 'Changes saved', body: 'Your settings were updated successfully.' },
  { color: 'warning', title: 'Storage almost full', body: 'You have used 90% of your quota.' },
  { color: 'danger', title: 'Payment failed', body: 'Check your card details and try again.' },
];

export function AlertShowcase() {
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Alert · Soft</div>
        <div className="showcase-stack is-wide">
          {statuses.map((s) => (
            <Alert key={s.color} color={s.color} title={s.title}>
              {s.body}
            </Alert>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Alert · Outline & Solid</div>
        <div className="showcase-stack is-wide">
          <Alert variant="outline" color="info" title="Outline variant">
            Border in the accent color on the surface.
          </Alert>
          <Alert variant="solid" color="danger" title="Solid variant">
            Filled with the accent color for high emphasis.
          </Alert>
          <Alert color="secondary" icon={false}>
            Title-less alert without an icon.
          </Alert>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Alert · Dismissible</div>
        <div className="showcase-stack is-wide">
          {dismissed ? (
            <div>
              <Button size="sm" variant="outline" onClick={() => setDismissed(false)}>
                Show alert again
              </Button>
            </div>
          ) : (
            <Alert color="success" title="Profile complete" onClose={() => setDismissed(true)}>
              Close this alert with the × button.
            </Alert>
          )}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Toast</div>
        <div className="frame-body">
          {statuses.map((s) => (
            <Button
              key={s.color}
              variant="soft"
              color={s.color}
              onClick={() => toast({ title: s.title, description: s.body, color: s.color })}
            >
              {s.color[0].toUpperCase() + s.color.slice(1)} toast
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: 'Sticky toast', description: 'Stays until you close it.', duration: 0 })
            }
          >
            Sticky toast
          </Button>
        </div>
      </div>
    </>
  );
}
