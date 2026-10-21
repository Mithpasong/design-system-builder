import { useState } from 'react';
import {
  Bold,
  Copy,
  Heart,
  Italic,
  Plus,
  Settings,
  Share2,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Trash,
  Underline,
} from 'lucide-react';
import { Button, ButtonGroup, IconButton, Tooltip, type Size } from '@design-token/react';

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export function IconButtonShowcase() {
  const [align, setAlign] = useState('left');

  return (
    <>
      <div className="frame">
        <div className="frame-label">Icon button · Variant</div>
        <div className="frame-body">
          <IconButton aria-label="Add" variant="solid">
            <Plus />
          </IconButton>
          <IconButton aria-label="Copy" variant="soft">
            <Copy />
          </IconButton>
          <IconButton aria-label="Share" variant="outline">
            <Share2 />
          </IconButton>
          <IconButton aria-label="Settings">
            <Settings />
          </IconButton>
          <IconButton aria-label="Delete" color="danger" variant="soft">
            <Trash />
          </IconButton>
          <Tooltip content="Like">
            <IconButton aria-label="Like" color="danger">
              <Heart />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Icon button · Size</div>
        <div className="frame-body">
          {sizes.map((s) => (
            <IconButton key={s} aria-label={`Add (${s})`} size={s} variant="outline">
              <Plus />
            </IconButton>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Button group</div>
        <div className="frame-body">
          <ButtonGroup aria-label="Text style">
            <IconButton aria-label="Bold" variant="outline">
              <Bold />
            </IconButton>
            <IconButton aria-label="Italic" variant="outline">
              <Italic />
            </IconButton>
            <IconButton aria-label="Underline" variant="outline">
              <Underline />
            </IconButton>
          </ButtonGroup>

          <ButtonGroup aria-label="Alignment">
            {[
              { value: 'left', icon: <TextAlignStart /> },
              { value: 'center', icon: <TextAlignCenter /> },
              { value: 'right', icon: <TextAlignEnd /> },
            ].map((a) => (
              <IconButton
                key={a.value}
                aria-label={`Align ${a.value}`}
                aria-pressed={align === a.value}
                variant={align === a.value ? 'solid' : 'outline'}
                onClick={() => setAlign(a.value)}
              >
                {a.icon}
              </IconButton>
            ))}
          </ButtonGroup>
        </div>
        <div className="frame-body">
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>Save</Button>
            <Button>Save as…</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}
