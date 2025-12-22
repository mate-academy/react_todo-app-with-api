import { useState, useEffect, useCallback, useRef } from 'react';

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleRemoveError = useCallback(() => setErrorMessage(''), []);
  const handleSetError = useCallback(
    (errorText: string) => {

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setErrorMessage(errorText); 
    },
    [],
  );

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
if (timerRef.current) {
  clearTimeout(timerRef.current);
}
    timerRef.current = setTimeout(handleRemoveError, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errorMessage, handleRemoveError]);

  return {
    errorMessage,
    handleRemoveError,
    handleSetError,
  };
};
