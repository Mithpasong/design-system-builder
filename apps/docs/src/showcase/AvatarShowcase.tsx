import { Avatar, AvatarGroup } from '@design-token/react';

const people = ['Kim Minji', 'Lee Jun', 'Park Seoyeon', 'Choi Hyun', 'Jung Yuna', 'Kang Doyoon'];

export function AvatarShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Size</div>
        <div className="frame-body">
          {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Avatar key={s} name="Kim Minji" size={s} />
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Initials fallback (color from name)</div>
        <div className="frame-body">
          {people.map((p) => (
            <Avatar key={p} name={p} size="lg" />
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Shape & Status</div>
        <div className="frame-body">
          <Avatar name="Lee Jun" size="lg" shape="square" />
          <Avatar name="Kim Minji" size="lg" status="online" />
          <Avatar name="Park Seoyeon" size="lg" status="away" />
          <Avatar name="Choi Hyun" size="lg" status="busy" />
          <Avatar name="Jung Yuna" size="lg" status="offline" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Group</div>
        <div className="frame-body">
          <AvatarGroup max={4}>
            {people.map((p) => (
              <Avatar key={p} name={p} />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}
