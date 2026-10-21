import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx, type Size } from '../shared';
import inputStyles from '../Input/Input.module.css';
import styles from './DatePicker.module.css';

/* ---------- date helpers (local time, day precision) ---------- */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  // Clamp the day so Jan 31 + 1 month -> Feb 28/29, not Mar 3
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
};
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const toKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/* ---------- calendar ---------- */

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** BCP 47 locale for month and weekday names; defaults to the browser's */
  locale?: string;
  weekStartsOn?: 0 | 1;
  /** Focus the selected (or today's) day on mount */
  autoFocus?: boolean;
  className?: string;
}

/** Month grid: arrows move by day / week, PageUp / PageDown by month, Home / End to week edges */
export function Calendar({ value, onChange, min, max, locale, weekStartsOn = 0, autoFocus, className }: CalendarProps) {
  const today = startOfDay(new Date());
  const [focused, setFocused] = useState(() => startOfDay(value ?? today));
  const [view, setView] = useState(() => new Date(focused.getFullYear(), focused.getMonth(), 1));
  const gridRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(autoFocus ?? false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${toKey(focused)}"]`)?.focus();
  }, [focused, view]);

  const isDisabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max));

  const focusDate = (d: Date) => {
    moveFocus.current = true;
    setFocused(d);
    if (!sameMonth(d, view)) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const showMonth = (delta: number) => {
    const next = addMonths(view, delta);
    setView(next);
    setFocused(addMonths(focused, delta));
  };

  // 6 weeks always, so the height doesn't jump between months
  const offset = (view.getDay() - weekStartsOn + 7) % 7;
  const first = addDays(view, -offset);
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    // 2024-01-07 is a Sunday
    new Date(2024, 0, 7 + weekStartsOn + i).toLocaleDateString(locale, { weekday: 'short' }),
  );
  const title = view.toLocaleDateString(locale, { year: 'numeric', month: 'long' });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const weekday = (focused.getDay() - weekStartsOn + 7) % 7;
    const next = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      Home: addDays(focused, -weekday),
      End: addDays(focused, 6 - weekday),
      PageUp: addMonths(focused, -1),
      PageDown: addMonths(focused, 1),
    }[e.key];
    if (!next) return;
    e.preventDefault();
    focusDate(next);
  };

  return (
    <div className={cx(styles.calendar, className)}>
      <div className={styles.header}>
        <button type="button" className={styles.nav} aria-label="Previous month" onClick={() => showMonth(-1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 4L6 8l4 4" />
          </svg>
        </button>
        <div className={styles.title} aria-live="polite">
          {title}
        </div>
        <button type="button" className={styles.nav} aria-label="Next month" onClick={() => showMonth(1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      <div ref={gridRef} role="grid" aria-label={title} className={styles.grid} onKeyDown={onKeyDown}>
        <div role="row" className={styles.row}>
          {weekdays.map((w) => (
            <div key={w} role="columnheader" className={styles.weekday}>
              {w}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} role="row" className={styles.row}>
            {days.slice(week * 7, week * 7 + 7).map((d) => {
              const selected = sameDay(d, value);
              const disabled = isDisabled(d);
              return (
                <div key={toKey(d)} role="gridcell" aria-selected={selected}>
                  <button
                    type="button"
                    data-date={toKey(d)}
                    tabIndex={sameDay(d, focused) ? 0 : -1}
                    disabled={disabled}
                    aria-label={d.toLocaleDateString(locale, { dateStyle: 'full' })}
                    aria-current={sameDay(d, today) ? 'date' : undefined}
                    className={cx(
                      styles.day,
                      !sameMonth(d, view) && styles.outside,
                      sameDay(d, today) && styles.today,
                      selected && styles.selected,
                    )}
                    onClick={() => {
                      setFocused(d);
                      if (!sameMonth(d, view)) setView(new Date(d.getFullYear(), d.getMonth(), 1));
                      onChange?.(d);
                    }}
                  >
                    {d.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- date picker ---------- */

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1;
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
  /** Start with the calendar open (static previews, docs) */
  defaultOpen?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

/** Input-styled button that opens a Calendar popover */
export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  placeholder = 'Select date',
  min,
  max,
  locale,
  weekStartsOn,
  size = 'md',
  invalid,
  disabled,
  defaultOpen = false,
  id,
  className,
  ...aria
}: DatePickerProps) {
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={cx(styles.picker, className)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        className={cx(inputStyles.field, inputStyles[`size-${size}`], invalid && inputStyles.invalid, styles.trigger)}
        onClick={() => setOpen((o) => !o)}
        {...aria}
      >
        <svg className={styles.triggerIcon} viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
          <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
        </svg>
        <span className={cx(styles.triggerText, !selected && styles.placeholder)}>
          {selected ? selected.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : placeholder}
        </span>
      </button>

      {open && (
        <div role="dialog" aria-label="Choose date" className={styles.popover}>
          <Calendar
            value={selected}
            min={min}
            max={max}
            locale={locale}
            weekStartsOn={weekStartsOn}
            autoFocus
            onChange={(d) => {
              if (value === undefined) setInner(d);
              onValueChange?.(d);
              close();
            }}
          />
        </div>
      )}
    </div>
  );
}
