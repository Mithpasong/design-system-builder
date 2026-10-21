import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { cx, type Color, type Size } from '../shared';
import styles from './Button.module.css';

export type ButtonSize = Size;

export type ButtonColor = Color;

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  color?: ButtonColor;
  size?: ButtonSize;
}

export function Button({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const classes = cx(styles.button, styles[`size-${size}`], styles[color], styles[variant], className);
  return <button className={classes} {...props} />;
}

export interface IconButtonProps extends ButtonProps {
  /** Required: icon-only buttons have no visible text */
  'aria-label': string;
}

/** Square button sized by the same height tokens; pass an icon as children */
export function IconButton({ className, variant = 'ghost', ...props }: IconButtonProps) {
  return <Button className={cx(styles.iconOnly, className)} variant={variant} {...props} />;
}

/** Joins adjacent buttons into one segmented control */
export function ButtonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cx(styles.group, className)} {...props} />;
}
