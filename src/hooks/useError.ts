import { useCallback, useState } from 'react';
import { ErrorType } from '../typedefs';

export const useError = () => {
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);

  const showError = (errorType: ErrorType) => {
    setError(errorType);
    setTimeout(() => setError(ErrorType.NONE), 3000);
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
