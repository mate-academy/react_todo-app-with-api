import { useEffect } from 'react';
import { useAppContext } from './useAppContext';
import { errors } from '../constants';

export const useErrorNotification = () => {
  const { errorType, setErrorType } = useAppContext();

  const errorMessage = errorType ? errors[errorType].message : '';

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    if (errorType) {
      timerID = setTimeout(() => {
        setErrorType(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timerID);
    };
  }, [errorType, setErrorType]);

  return { errorMessage, setErrorType };
};
