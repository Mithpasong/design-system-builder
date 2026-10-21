import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../shared';
import styles from './Tooltip.module.css';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  placement?: Placement;
  /** Always show the tip (static previews, docs) */
  open?: boolean;
  /** A single focusable element, usually a button */
  children: ReactElement;
}

/** Shows on hover and keyboard focus; the trigger is described by the tip */
export function Tooltip({ content, placement = 'top', open, children }: TooltipProps) {
  const id = useId();
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': id })
    : children;

  return (
    <span className={cx(styles.root, styles[placement], open && styles.open)}>
      {trigger}
      <span role="tooltip" id={id} className={styles.tip}>
        {content}
      </span>
    </span>
  );
}

export interface PopoverProps {
  /** Element that toggles the popover on click, usually a button */
  trigger: ReactElement;
  /** Content, or a render function receiving `close` */
  children: ReactNode | ((close: () => void) => ReactNode);
  placement?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  /** Start opened (static previews, docs) */
  defaultOpen?: boolean;
  className?: string;
}

/** Click-to-open panel; closes on outside click and Escape */
export function Popover({
  trigger,
  children,
  placement = 'bottom',
  align = 'start',
  defaultOpen = false,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      rootRef.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const triggerProps = trigger.props as { onClick?: (e: unknown) => void };
  const triggerEl = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': id,
    onClick: (e: unknown) => {
      triggerProps.onClick?.(e);
      setOpen((o) => !o);
    },
  });

  return (
    <span ref={rootRef} className={styles.popoverRoot}>
      {triggerEl}
      {open && (
        <div
          id={id}
          role="dialog"
          className={cx(styles.popover, styles[`popover-${placement}`], styles[`align-${align}`], className)}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </span>
  );
}
