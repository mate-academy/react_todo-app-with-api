import { useRef, useState } from 'react';
import { Error } from '../types';

export const useError = () => {
  const [error, setError] = useState<Error>(Error.DEFAULT);

  const errorTimeoutId = useRef<NodeJS.Timeout>();

  const handleResetError = () => setError(Error.DEFAULT);

  const handleError = (message: Error) => {
    setError(message);

    clearTimeout(errorTimeoutId.current);

    errorTimeoutId.current = setTimeout(handleResetError, 3000);
  };

  return { error, handleError, handleResetError };
};
