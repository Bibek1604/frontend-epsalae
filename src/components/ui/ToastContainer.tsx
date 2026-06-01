// ============================================
// TOAST CONTAINER COMPONENT
// ============================================
// Container for displaying multiple toast notifications

import React from 'react';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'bottom-right' }) => {
  const { toasts, remove } = useToast();

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none'
    };

    const positionMap: Record<string, React.CSSProperties> = {
      'top-right': {
        top: '20px',
        right: '20px'
      },
      'top-left': {
        top: '20px',
        left: '20px'
      },
      'bottom-right': {
        bottom: '20px',
        right: '20px'
      },
      'bottom-left': {
        bottom: '20px',
        left: '20px'
      }
    };

    return {
      ...baseStyles,
      ...positionMap[position]
    };
  };

  return (
    <div style={getPositionStyles()}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto'
          }}
        >
          <Toast toast={toast} onClose={() => remove(toast.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
