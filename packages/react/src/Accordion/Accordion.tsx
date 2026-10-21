import { useId, useState, type ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Accordion.module.css';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** single: opening one closes the others */
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  variant?: 'separated' | 'contained';
  className?: string;
}

export function Accordion({ items, type = 'single', defaultValue = [], variant = 'contained', className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultValue);
  const baseId = useId();

  const toggle = (value: string) =>
    setOpen((current) => {
      if (current.includes(value)) return current.filter((v) => v !== value);
      return type === 'single' ? [value] : [...current, value];
    });

  return (
    <div className={cx(styles.accordion, styles[variant], className)}>
      {items.map((item, i) => {
        const expanded = open.includes(item.value);
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.value} className={cx(styles.item, expanded && styles.expanded)}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={triggerId}
                className={styles.trigger}
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
              >
                <span className={styles.title}>{item.title}</span>
                <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
            </h3>
            {/* Grid row 0fr -> 1fr animates to the content's natural height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.panel}
              inert={!expanded}
            >
              <div className={styles.panelInner}>
                <div className={styles.content}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
