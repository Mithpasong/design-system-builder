import type { HTMLAttributes } from 'react';
import { cx } from '../shared';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'outline' | 'elevated' | 'filled';
  /** Lifts on hover; pair with onClick / tabIndex for clickable cards */
  interactive?: boolean;
}

export function Card({ variant = 'outline', interactive, className, ...props }: CardProps) {
  return <div className={cx(styles.card, styles[variant], interactive && styles.interactive, className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.header, className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx(styles.title, className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx(styles.description, className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.body, className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}
