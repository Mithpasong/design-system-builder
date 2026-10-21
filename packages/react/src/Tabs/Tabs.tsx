import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled selected value */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** line: underline indicator, pill: segmented control */
  variant?: 'line' | 'pill';
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, variant = 'line', className }: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const current = value ?? inner;
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const select = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  // Indicator slides to the selected tab; re-measure when tabs resize (e.g. font size tokens change)
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const tab = list.querySelector<HTMLElement>('[aria-selected="true"]');
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [current, items]);

  // Arrow keys / Home / End move between enabled tabs (automatic activation)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const index = enabled.findIndex((i) => i.value === current);
    const target = {
      ArrowRight: enabled[(index + 1) % enabled.length],
      ArrowLeft: enabled[(index - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    }[e.key];
    if (!target) return;
    e.preventDefault();
    select(target.value);
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(target.value)}"]`)?.focus();
  };

  return (
    <div className={cx(styles.tabs, styles[variant], className)}>
      <div ref={listRef} role="tablist" className={styles.list} onKeyDown={onKeyDown}>
        {items.map((item, i) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-controls={`${baseId}-panel-${i}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              data-value={item.value}
              className={styles.tab}
              onClick={() => select(item.value)}
            >
              {item.label}
            </button>
          );
        })}
        {indicator && (
          <span
            className={styles.indicator}
            style={{ left: indicator.left, width: indicator.width }}
            aria-hidden="true"
          />
        )}
      </div>

      {items.map((item, i) =>
        item.value === current ? (
          <div
            key={item.value}
            role="tabpanel"
            id={`${baseId}-panel-${i}`}
            aria-labelledby={`${baseId}-tab-${i}`}
            tabIndex={0}
            className={styles.panel}
          >
            {item.content}
          </div>
        ) : null,
      )}
    </div>
  );
}
