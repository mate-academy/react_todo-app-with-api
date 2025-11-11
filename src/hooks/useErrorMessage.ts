import { useCallback, useEffect, useRef, useState } from 'react';

export const useErrorMessage = (autoHideTimeout = 3000) => {
  const [message, setMessage] = useState('');
  const timerRef = useRef<number | null>(null);

  const hideError = useCallback(() => setMessage(''), []);
  const showError = useCallback((text: string) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setMessage(text);
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    timerRef.current = window.setTimeout(() => setMessage(''), autoHideTimeout);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = null;
    };
  }, [message, autoHideTimeout]);

  return [message, showError, hideError] as const;
};
