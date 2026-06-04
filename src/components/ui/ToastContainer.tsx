// ============================================
// TOAST CONTAINER COMPONENT — Premium branded
// ============================================

import React from 'react';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ToastContainerProps {
  position?: Position;
}

const positionStyles: Record<Position, React.CSSProperties> = {
  'top-right':    { top: 20, right: 20 },
  'top-left':     { top: 20, left: 20 },
  'bottom-right': { bottom: 20, right: 20 },
  'bottom-left':  { bottom: 20, left: 20 },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const { toasts, remove } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        ...positionStyles[position],
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast toast={toast} onClose={() => remove(toast.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
