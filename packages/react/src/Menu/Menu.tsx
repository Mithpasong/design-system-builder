import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../shared';
import styles from './Menu.module.css';

export type MenuEntry =
  | {
      label: ReactNode;
      onSelect?: () => void;
      icon?: ReactNode;
      /** Right-aligned hint, e.g. a keyboard shortcut */
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
    }
  | 'separator';

export interface DropdownMenuProps {
  /** Element that opens the menu on click, usually a button */
  trigger: ReactElement;
  items: MenuEntry[];
  align?: 'start' | 'end';
  /** Start opened (static previews, docs) */
  defaultOpen?: boolean;
  className?: string;
}

/** Action menu: arrow keys move, Enter / Space activate, Escape or outside click closes */
export function DropdownMenu({ trigger, items, align = 'start', defaultOpen = false, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) rootRef.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
  };

  useEffect(() => {
    if (!open) return;
    enabledItems()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = enabledItems();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const target = {
      ArrowDown: list[(index + 1) % list.length],
      ArrowUp: list[(index - 1 + list.length) % list.length],
      Home: list[0],
      End: list[list.length - 1],
    }[e.key];
    if (target) {
      e.preventDefault();
      target.focus();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      close(true);
    }
  };

  const triggerProps = trigger.props as { onClick?: (e: unknown) => void };
  const triggerEl = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': id,
    onClick: (e: unknown) => {
      triggerProps.onClick?.(e);
      setOpen((o) => !o);
    },
  });

  return (
    <span ref={rootRef} className={styles.root}>
      {triggerEl}
      {open && (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          className={cx(styles.menu, styles[`align-${align}`], className)}
          onKeyDown={onKeyDown}
        >
          {items.map((item, i) =>
            item === 'separator' ? (
              <div key={i} role="separator" className={styles.separator} />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                className={cx(styles.item, item.danger && styles.danger)}
                onClick={() => {
                  item.onSelect?.();
                  close(true);
                }}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
                {item.shortcut && <kbd className={styles.shortcut}>{item.shortcut}</kbd>}
              </button>
            ),
          )}
        </div>
      )}
    </span>
  );
}
