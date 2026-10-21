import { useState } from 'react';
import { Button, Dialog, Input, Textarea, useToast } from '@design-token/react';

type Open = 'sm' | 'md' | 'lg' | 'confirm' | 'form' | null;

export function DialogShowcase() {
  const [open, setOpen] = useState<Open>(null);
  const { toast } = useToast();
  const close = () => setOpen(null);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Size</div>
        <div className="frame-body">
          <Button variant="outline" onClick={() => setOpen('sm')}>
            Small
          </Button>
          <Button variant="outline" onClick={() => setOpen('md')}>
            Medium
          </Button>
          <Button variant="outline" onClick={() => setOpen('lg')}>
            Large
          </Button>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Patterns</div>
        <div className="frame-body">
          <Button color="danger" onClick={() => setOpen('confirm')}>
            Delete project
          </Button>
          <Button onClick={() => setOpen('form')}>Send feedback</Button>
        </div>
      </div>

      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog
          key={size}
          open={open === size}
          onClose={close}
          size={size}
          title={`${size.toUpperCase()} dialog`}
          description="Dialogs use shadow xl, radius lg and the slow motion duration."
          footer={<Button onClick={close}>Got it</Button>}
        />
      ))}

      <Dialog
        open={open === 'confirm'}
        onClose={close}
        size="sm"
        title="Delete project?"
        description="This permanently deletes the project and all of its files. This can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={() => {
                close();
                toast({ title: 'Project deleted', color: 'danger' });
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <Dialog
        open={open === 'form'}
        onClose={close}
        title="Send feedback"
        description="Tell us what you think about the design tokens."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                close();
                toast({ title: 'Thanks for your feedback!', color: 'success' });
              }}
            >
              Send
            </Button>
          </>
        }
      >
        <Input placeholder="Subject" aria-label="Subject" />
        <Textarea placeholder="Your message…" aria-label="Message" />
      </Dialog>
    </>
  );
}
