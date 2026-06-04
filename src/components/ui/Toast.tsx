// ============================================
// TOAST COMPONENT — Premium branded design
// ============================================

import React, { useEffect, useRef } from 'react';
import { Toast as ToastType, ToastType as ToastTypeEnum } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

// SVG icon components for crisp rendering
const Icons: Record<ToastTypeEnum, React.FC> = {
  success: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#16a34a" opacity="0.12" />
      <circle cx="9" cy="9" r="8" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      <path d="M5.5 9.25l2.5 2.5 4.5-5" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#dc2626" opacity="0.12" />
      <circle cx="9" cy="9" r="8" stroke="#dc2626" strokeWidth="1.5" fill="none" />
      <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="#dc2626" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  warning: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.5L16.5 15H1.5L9 1.5z" fill="#f59e0b" opacity="0.12" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7v4" stroke="#d97706" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="12.5" r="0.875" fill="#d97706" />
    </svg>
  ),
  info: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#1A3C8A" opacity="0.10" />
      <circle cx="9" cy="9" r="8" stroke="#1A3C8A" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="5.5" r="0.875" fill="#1A3C8A" />
      <path d="M9 8v5" stroke="#1A3C8A" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
};

const typeConfig: Record<ToastTypeEnum, {
  bg: string;
  border: string;
  text: string;
  subtext: string;
  bar: string;
  shadow: string;
}> = {
  success: {
    bg: 'linear-gradient(135deg, rgba(240,253,244,0.99) 0%, rgba(220,252,231,0.99) 100%)',
    border: 'rgba(134,239,172,0.6)',
    text: '#14532d',
    subtext: '#166534',
    bar: 'linear-gradient(90deg, #16a34a, #22c55e)',
    shadow: '0 10px 36px -6px rgba(16,185,129,0.22), 0 2px 8px -2px rgba(16,185,129,0.12)',
  },
  error: {
    bg: 'linear-gradient(135deg, rgba(255,241,242,0.99) 0%, rgba(254,226,226,0.99) 100%)',
    border: 'rgba(252,165,165,0.6)',
    text: '#7f1d1d',
    subtext: '#991b1b',
    bar: 'linear-gradient(90deg, #dc2626, #ef4444)',
    shadow: '0 10px 36px -6px rgba(239,68,68,0.22), 0 2px 8px -2px rgba(239,68,68,0.12)',
  },
  warning: {
    bg: 'linear-gradient(135deg, rgba(255,251,235,0.99) 0%, rgba(254,243,199,0.99) 100%)',
    border: 'rgba(253,230,138,0.7)',
    text: '#78350f',
    subtext: '#92400e',
    bar: 'linear-gradient(90deg, #d97706, #f59e0b)',
    shadow: '0 10px 36px -6px rgba(245,158,11,0.22), 0 2px 8px -2px rgba(245,158,11,0.12)',
  },
  info: {
    bg: 'linear-gradient(135deg, rgba(239,246,255,0.99) 0%, rgba(219,234,254,0.99) 100%)',
    border: 'rgba(147,197,253,0.6)',
    text: '#1e3a8a',
    subtext: '#1d4ed8',
    bar: 'linear-gradient(90deg, #1A3C8A, #FF6B35)',
    shadow: '0 10px 36px -6px rgba(26,60,138,0.22), 0 2px 8px -2px rgba(26,60,138,0.12)',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const duration = toast.duration && toast.duration > 0 ? toast.duration : 4000;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (duration <= 0) return;

    const step = 50;
    const decrement = (step / duration) * 100;
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p - decrement;
        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return next;
      });
    }, step);

    const timer = setTimeout(() => handleClose(), duration);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsClosing(true);
    setTimeout(() => onClose(), 340);
  };

  const cfg = typeConfig[toast.type];
  const Icon = Icons[toast.type];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
    padding: '13px 14px',
    borderRadius: '16px',
    marginBottom: '10px',
    background: cfg.bg,
    border: `1px solid ${cfg.border}`,
    boxShadow: cfg.shadow,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    animation: isClosing
      ? 'toastSlideOut 0.34s cubic-bezier(0.4,0,1,1) forwards'
      : 'toastSlideIn 0.34s cubic-bezier(0,0,0.2,1)',
    minWidth: '290px',
    maxWidth: '400px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(420px) scale(0.92); opacity: 0; }
          to   { transform: translateX(0) scale(1);   opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0) scale(1);   opacity: 1; }
          to   { transform: translateX(420px) scale(0.92); opacity: 0; }
        }
      `}</style>

      <div style={containerStyle} role="alert" aria-live="polite">
        {/* Icon */}
        <div style={{ flexShrink: 0, marginTop: '1px' }}>
          <Icon />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: '13.5px',
            fontWeight: 600,
            color: cfg.text,
            lineHeight: '1.45',
            letterSpacing: '-0.01em',
          }}>
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={() => { toast.action?.onClick(); handleClose(); }}
              style={{
                marginTop: '5px',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                color: cfg.subtext,
                textDecoration: 'underline',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Dismiss notification"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: cfg.text,
            opacity: 0.45,
            fontSize: '16px',
            lineHeight: 1,
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
            marginTop: '-1px',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
        >
          ×
        </button>

        {/* Countdown progress bar */}
        {duration > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: `${progress}%`,
            background: cfg.bar,
            borderRadius: '0 0 0 16px',
            transition: 'width 50ms linear',
          }} />
        )}
      </div>
    </>
  );
};

export default Toast;
