import { useMemo, useState, type ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Table.module.css';

export interface TableColumn<Row> {
  key: keyof Row & string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: number | string;
  /** Custom cell; defaults to the raw value */
  render?: (row: Row) => ReactNode;
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Unique key per row */
  rowKey: (row: Row) => string | number;
  density?: 'compact' | 'comfortable';
  striped?: boolean;
  caption?: ReactNode;
  /** Shown when `rows` is empty */
  empty?: ReactNode;
  className?: string;
}

type Sort = { key: string; direction: 'asc' | 'desc' } | null;

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true });
}

export function Table<Row extends object>({
  columns,
  rows,
  rowKey,
  density = 'comfortable',
  striped,
  caption,
  empty = 'No data',
  className,
}: TableProps<Row>) {
  const [sort, setSort] = useState<Sort>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const key = sort.key as keyof Row;
    const result = [...rows].sort((a, b) => compare(a[key], b[key]));
    return sort.direction === 'asc' ? result : result.reverse();
  }, [rows, sort]);

  // asc -> desc -> unsorted
  const cycleSort = (key: string) =>
    setSort((s) => {
      if (s?.key !== key) return { key, direction: 'asc' };
      return s.direction === 'asc' ? { key, direction: 'desc' } : null;
    });

  return (
    <div className={cx(styles.wrapper, className)}>
      <table className={cx(styles.table, styles[density], striped && styles.striped)}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              const ariaSort = active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? (ariaSort ?? 'none') : undefined}
                  className={styles[col.align ?? 'left']}
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => cycleSort(col.key)}>
                      {col.header}
                      <svg
                        className={cx(styles.sortIcon, active && styles[sort.direction])}
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path className={styles.up} d="M5 6.5L8 3.5l3 3" />
                        <path className={styles.down} d="M5 9.5l3 3 3-3" />
                      </svg>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {empty}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={styles[col.align ?? 'left']}>
                    {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
