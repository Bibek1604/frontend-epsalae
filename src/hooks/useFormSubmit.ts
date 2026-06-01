// ============================================
// USE FORM SUBMIT HOOK
// ============================================
// Hook for managing form submission with loading, errors, and toast notifications

import { useState, useCallback } from 'react';
import { useToast } from './useToast';
import { handleApiError } from '../config/api.config';

interface FormSubmitOptions {
  onSuccess?: (data: any) => void | Promise<void>;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
}

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  const submit = useCallback(
    async (
      submitFn: () => Promise<any>,
      options: FormSubmitOptions = {}
    ) => {
      const {
        onSuccess,
        onError,
        successMessage = 'Success!',
        errorMessage,
        showSuccessToast = true
      } = options;

      setLoading(true);
      setErrors({});

      try {
        const result = await submitFn();

        // Show success toast
        if (showSuccessToast) {
          success(successMessage);
        }

        // Call onSuccess callback
        if (onSuccess) {
          await onSuccess(result);
        }

        return result;
      } catch (err: any) {
        // Extract error message
        let message = errorMessage || handleApiError(err);

        // Extract field-level errors from API response
        if (err.response?.data?.error?.details) {
          setErrors(err.response.data.error.details);
        }

        // Show error toast if not already shown by API handler
        if (!errorMessage) {
          showError(message);
        }

        // Call onError callback
        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [success, showError]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    loading,
    errors,
    submit,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default useFormSubmit;
