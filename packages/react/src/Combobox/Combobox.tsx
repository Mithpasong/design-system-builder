import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx, type Size } from '../shared';
import inputStyles from '../Input/Input.module.css';
import styles from './Combobox.module.css';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text shown to the right */
  hint?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  size?: Size;
  invalid?: boolean;
  disabled?: boolean;
  /** Shown when nothing matches the query */
  emptyText?: string;
  /** Start with the list open (static previews, docs) */
  defaultOpen?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

/** Searchable select: type to filter, arrows to move, Enter to pick, Escape to close */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  size = 'md',
  invalid,
  disabled,
  emptyText = 'No results',
  defaultOpen = false,
  id,
  className,
  ...aria
}: ComboboxProps) {
  const [inner, setInner] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';

  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  // query === null means "not typing": the input shows the selected label and the full list
  const filtered = useMemo(() => {
    const q = query?.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const openList = () => {
    setOpen(true);
    const index = filtered.findIndex((o) => o.value === selected);
    setActive(Math.max(0, index));
  };

  const closeList = () => {
    setOpen(false);
    setQuery(null);
  };

  const pick = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (value === undefined) setInner(option.value);
    onValueChange?.(option.value);
    closeList();
  };

  const move = (delta: number) => {
    if (!filtered.length) return;
    let next = active;
    // Skip disabled options
    for (let i = 0; i < filtered.length; i++) {
      next = (next + delta + filtered.length) % filtered.length;
      if (!filtered[next].disabled) break;
    }
    setActive(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) openList();
      else move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      const option = filtered[active];
      if (option) pick(option);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeList();
    }
  };

  const activeOption = open ? filtered[active] : undefined;

  return (
    <div className={cx(styles.root, className)}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOption ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        className={cx(inputStyles.field, inputStyles[`size-${size}`], invalid && inputStyles.invalid, styles.input)}
        value={query ?? selectedLabel}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={openList}
        onClick={() => !open && openList()}
        onBlur={closeList}
        onKeyDown={onKeyDown}
        {...aria}
      />
      <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" />
      </svg>

      {open && (
        <ul ref={listRef} id={listId} role="listbox" className={styles.list}>
          {filtered.length === 0 ? (
            <li className={styles.empty}>{emptyText}</li>
          ) : (
            filtered.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={option.disabled || undefined}
                className={cx(styles.option, i === active && styles.active)}
                // mousedown + preventDefault keeps focus in the input so blur doesn't close the list first
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(option);
                }}
                onMouseEnter={() => !option.disabled && setActive(i)}
              >
                <span className={styles.label}>{option.label}</span>
                {option.hint && <span className={styles.hint}>{option.hint}</span>}
                {option.value === selected && (
                  <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
