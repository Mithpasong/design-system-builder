import { Checkbox, Radio, Switch, type Color } from '@design-token/react';

const colors: Color[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export function ChoiceShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Checkbox</div>
        <div className="frame-body">
          <Checkbox>Unchecked</Checkbox>
          <Checkbox defaultChecked>Checked</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox disabled defaultChecked>
            Disabled checked
          </Checkbox>
        </div>
        <div className="frame-body">
          {colors.map((c) => (
            <Checkbox key={c} color={c} defaultChecked>
              {capitalize(c)}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Radio</div>
        <div className="frame-body" role="radiogroup" aria-label="Plan">
          <Radio name="plan" defaultChecked>
            Free
          </Radio>
          <Radio name="plan">Pro</Radio>
          <Radio name="plan">Team</Radio>
          <Radio name="plan" disabled>
            Enterprise
          </Radio>
        </div>
        <div className="frame-body">
          {colors.map((c) => (
            <Radio key={c} name={`radio-${c}`} color={c} defaultChecked>
              {capitalize(c)}
            </Radio>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Switch</div>
        <div className="frame-body">
          <Switch>Off</Switch>
          <Switch defaultChecked>On</Switch>
          <Switch disabled>Disabled</Switch>
          <Switch disabled defaultChecked>
            Disabled on
          </Switch>
        </div>
        <div className="frame-body">
          {colors.map((c) => (
            <Switch key={c} color={c} defaultChecked>
              {capitalize(c)}
            </Switch>
          ))}
        </div>
      </div>
    </>
  );
}
