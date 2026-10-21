import { cx } from '../shared';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** 1-based current page */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one before an ellipsis */
  siblings?: number;
  className?: string;
}

/** Page numbers with ellipses: 1 … 4 5 [6] 7 8 … 20 */
function pageRange(page: number, count: number, siblings: number): (number | 'gap')[] {
  // first + last + current + siblings + two gaps
  if (count <= siblings * 2 + 5) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, page - siblings);
  const end = Math.min(count - 1, page + siblings);
  const pages: (number | 'gap')[] = [1];
  if (start > 2) pages.push('gap');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push('gap');
  pages.push(count);
  return pages;
}

export function Pagination({ page, pageCount, onPageChange, siblings = 1, className }: PaginationProps) {
  const go = (p: number) => onPageChange(Math.min(pageCount, Math.max(1, p)));

  return (
    <nav aria-label="Pagination" className={cx(styles.pagination, className)}>
      <button type="button" className={styles.item} disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous page">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 4L6 8l4 4" />
        </svg>
      </button>
      {pageRange(page, pageCount, siblings).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className={styles.gap} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cx(styles.item, p === page && styles.current)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={styles.item}
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4l4 4-4 4" />
        </svg>
      </button>
    </nav>
  );
}
