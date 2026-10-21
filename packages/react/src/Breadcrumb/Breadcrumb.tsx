import type { MouseEvent, ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps {
  /** The last item is the current page */
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash';
  className?: string;
}

export function Breadcrumb({ items, separator = 'chevron', className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cx(styles.list, styles[separator])}>
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {current ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a className={styles.link} href={item.href ?? '#'} onClick={item.onClick}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
