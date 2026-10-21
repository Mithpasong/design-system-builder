import { useState } from 'react';
import { Badge, Button, Tag, type Color } from '@design-token/react';

const colors: Color[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
const variants = ['solid', 'soft', 'outline'] as const;
const initialTags = ['Design', 'Tokens', 'React', 'CSS'];

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export function BadgeShowcase() {
  const [tags, setTags] = useState(initialTags);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Badge · Variant & Color</div>
        {variants.map((v) => (
          <div key={v} className="frame-body">
            {colors.map((c) => (
              <Badge key={c} variant={v} color={c}>
                {capitalize(c)}
              </Badge>
            ))}
          </div>
        ))}
      </div>

      <div className="frame">
        <div className="frame-label">Badge · Size & Shape</div>
        <div className="frame-body">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="sm" pill color="success">
            Pill
          </Badge>
          <Badge pill variant="solid" color="danger">
            99+
          </Badge>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Tag</div>
        <div className="frame-body">
          {tags.map((t) => (
            <Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
              {t}
            </Tag>
          ))}
          {tags.length < initialTags.length && (
            <Button size="xs" variant="ghost" onClick={() => setTags(initialTags)}>
              Restore
            </Button>
          )}
        </div>
        <div className="frame-body">
          {colors.map((c) => (
            <Tag key={c} color={c}>
              {capitalize(c)}
            </Tag>
          ))}
        </div>
      </div>
    </>
  );
}
