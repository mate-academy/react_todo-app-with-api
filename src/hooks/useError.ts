import { useCallback, useRef, useState } from 'react';
import { ErrorMessages } from '../types';

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.DEFAULT,
  );

  const errorTimeoutId = useRef<NodeJS.Timeout>();

  const handleResetErrorMessage = useCallback(
    () => setErrorMessage(ErrorMessages.DEFAULT),
    [],
  );

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);
    clearTimeout(errorTimeoutId.current);

    errorTimeoutId.current = setTimeout(handleResetErrorMessage, 3000);
  };

  return { errorMessage, handleError, handleResetErrorMessage };
};
