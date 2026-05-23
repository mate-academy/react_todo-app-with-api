import { useState, useEffect, useCallback } from 'react';
import { Nullable } from '../types/Nullable';
import { AppError } from '../types/Error';

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState<Nullable<AppError>>(null);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = globalThis.setTimeout(() => {
      clearErrorMessage();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, clearErrorMessage]);

  return { errorMessage, setErrorMessage, clearErrorMessage };
};
