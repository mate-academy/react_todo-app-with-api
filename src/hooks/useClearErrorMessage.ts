import { useEffect } from 'react';
import { ErrorMessages } from '../enum/ErrorMessages';

export const useClearErrorMessage = (
  errorMessage: string,
  setErrorMessage: (message: ErrorMessages) => void,
) => {
  useEffect(() => {
    let mistakeTimer: number | undefined;

    if (errorMessage) {
      mistakeTimer = window.setTimeout(() => {
        setErrorMessage(ErrorMessages.none);
      }, 3000);
    }

    return () => {
      if (mistakeTimer !== undefined) {
        window.clearTimeout(mistakeTimer);
      }
    };
  }, [errorMessage, setErrorMessage]);
};
