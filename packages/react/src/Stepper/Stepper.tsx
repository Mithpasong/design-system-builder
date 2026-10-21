import type { ReactNode } from 'react';
import { cx } from '../shared';
import styles from './Stepper.module.css';

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps {
  steps: Step[];
  /** 0-based index of the active step; steps before it are complete */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({ steps, current, orientation = 'horizontal', className }: StepperProps) {
  return (
    <ol className={cx(styles.stepper, styles[orientation], className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'complete' : i === current ? 'active' : 'upcoming';
        return (
          <li key={i} className={cx(styles.step, styles[state])} aria-current={state === 'active' ? 'step' : undefined}>
            <span className={styles.marker} aria-hidden="true">
              {state === 'complete' ? (
                <svg viewBox="0 0 16 16">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{step.label}</span>
              {step.description && <span className={styles.description}>{step.description}</span>}
              <span className={styles.srOnly}>
                {state === 'complete' ? ' (completed)' : state === 'active' ? ' (current)' : ''}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
