import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CloseIcon, StatusIcon } from '../icons';
import { colorVars, cx, type Color } from '../shared';
import styles from './Toast.module.css';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  color?: Color;
  /** Auto-dismiss delay in ms; 0 keeps the toast until closed */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  color: Color;
  duration: number;
  leaving: boolean;
}

interface ToastContextValue {
  /** Show a toast and return its id */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  placement?: 'top-right' | 'bottom-right' | 'bottom-center';
  children: ReactNode;
}

export function ToastProvider({ placement = 'bottom-right', children }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((options: ToastOptions) => {
    const id = ++nextId.current;
    setItems((all) => [...all, { color: 'info', duration: 4000, ...options, id, leaving: false }]);
    return id;
  }, []);

  // Mark as leaving first so the exit animation can play, then remove
  const dismiss = useCallback(
    (id: number) => setItems((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t))),
    [],
  );
  const remove = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className={cx(styles.viewport, styles[placement])} aria-live="polite">
        {items.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={dismiss} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({
  item,
  onDismiss,
  onRemove,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const { id, title, description, color, duration, leaving } = item;

  useEffect(() => {
    if (leaving || duration <= 0) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, leaving, onDismiss]);

  // Fallback in case animationend never fires (e.g. animations disabled)
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onRemove(id), 1000);
    return () => clearTimeout(timer);
  }, [id, leaving, onRemove]);

  return (
    <div
      className={cx(styles.toast, leaving && styles.leaving)}
      style={colorVars(color)}
      role={color === 'danger' ? 'alert' : 'status'}
      onAnimationEnd={() => leaving && onRemove(id)}
    >
      <StatusIcon color={color} className={styles.icon} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <button type="button" className={styles.close} aria-label="Dismiss" onClick={() => onDismiss(id)}>
        <CloseIcon />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
