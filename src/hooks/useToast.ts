// ============================================
// USE TOAST HOOK
// ============================================
// Custom hook for accessing toast notifications

import { useContext } from 'react';
import { ToastContext, ToastType } from '../contexts/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return {
    toasts: context.toasts,
    showToast: (message: string, type: ToastType, duration?: number) =>
      context.addToast(message, type, duration),
    success: (message: string, duration?: number) =>
      context.addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      context.addToast(message, 'error', duration),
    warning: (message: string, duration?: number) =>
      context.addToast(message, 'warning', duration),
    info: (message: string, duration?: number) =>
      context.addToast(message, 'info', duration),
    remove: context.removeToast,
    clear: context.clearToasts
  };
};

export default useToast;
