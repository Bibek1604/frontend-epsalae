// ============================================
// TOAST COMPONENT
// ============================================
// Individual toast notification component

import React, { useEffect } from 'react';
import { Toast as ToastType, ToastType as ToastTypeEnum } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isClosing, setIsClosing] = React.useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getStyles = (): { container: React.CSSProperties; icon: React.CSSProperties } => {
    const baseContainer: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      animation: isClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '280px',
      maxWidth: '400px'
    };

    const baseIcon: React.CSSProperties = {
      fontSize: '20px',
      flexShrink: 0
    };

    const typeStyles: Record<ToastTypeEnum, { bg: string; text: string; border: string; icon: string }> = {
      success: {
        bg: '#dcfce7',
        text: '#166534',
        border: '#bbf7d0',
        icon: '✓'
      },
      error: {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#fecaca',
        icon: '✕'
      },
      warning: {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fde68a',
        icon: '⚠'
      },
      info: {
        bg: '#dbeafe',
        text: '#0c2d6b',
        border: '#bfdbfe',
        icon: 'ⓘ'
      }
    };

    const style = typeStyles[toast.type];

    return {
      container: {
        ...baseContainer,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`
      },
      icon: {
        ...baseIcon,
        color: style.text
      }
    };
  };

  const styles = getStyles();

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>

      <div style={styles.container}>
        <span style={styles.icon}>{getIcon(toast.type)}</span>
        <div style={{ flex: 1 }}>{toast.message}</div>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0',
              fontSize: '14px',
              fontWeight: '600',
              marginLeft: '8px'
            }}
          >
            {toast.action.label}
          </button>
        )}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            marginLeft: '8px',
            opacity: 0.7,
            hover: { opacity: 1 }
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};

function getIcon(type: ToastTypeEnum): string {
  const icons: Record<ToastTypeEnum, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ'
  };
  return icons[type];
}

export default Toast;
