import { useCallback, useEffect, useState } from 'react';
import { ErrorType } from '../typedefs';

export const useError = () => {
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    const timeout = setTimeout(() => setError(ErrorType.NONE), 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const showError = (errorType: ErrorType) => {
    setError(errorType);
  };

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  return {
    error,
    showError,
    handleCloseError,
  };
};
