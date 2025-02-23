/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useRef } from 'react';
import { FormInputContext } from '../contexts/FormInputContext';
import { ErrorContext } from '../contexts/ErrorContext';

export const useCreateAction = <T extends any[], P>(
  createPromise: (...args: T) => Promise<P>,
) => {
  const { setDisabled } = useContext(FormInputContext);
  const { setError } = useContext(ErrorContext);
  const createPromiseRef = useRef(createPromise);

  useEffect(() => {
    createPromiseRef.current = createPromise;
  }, [createPromise]);

  const createAction = useCallback(
    async (...args: T) => {
      setDisabled(true);
      setError({ message: '' });

      try {
        return await createPromiseRef.current(...args);
      } finally {
        setDisabled(false);
      }
    },
    [setDisabled, setError],
  );

  return createAction;
};
