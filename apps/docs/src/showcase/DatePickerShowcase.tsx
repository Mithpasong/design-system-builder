import { useState } from 'react';
import { Calendar, DatePicker, Field } from '@design-token/react';

const today = new Date();
const inDays = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

export function DatePickerShowcase() {
  const [date, setDate] = useState<Date | null>(today);
  const [calendarDate, setCalendarDate] = useState<Date>(inDays(3));

  return (
    <>
      <div className="frame">
        <div className="frame-label">Date picker</div>
        <div className="showcase-stack">
          <Field label="Due date" hint={date ? date.toDateString() : 'No date'}>
            <DatePicker value={date} onValueChange={setDate} />
          </Field>
          <Field label="Within the next 30 days" hint="Past and far-future dates are disabled">
            <DatePicker min={today} max={inDays(30)} weekStartsOn={1} />
          </Field>
          <DatePicker size="sm" placeholder="Small" aria-label="Small date" />
          <DatePicker disabled aria-label="Disabled date" />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Inline calendar</div>
        <div className="showcase-panel" style={{ display: 'inline-block' }}>
          <Calendar value={calendarDate} onChange={setCalendarDate} />
        </div>
      </div>
    </>
  );
}
