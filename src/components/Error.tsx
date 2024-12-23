import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

type Props = {
  errorMessage: ErrorTypes | null;
  setErrorMessage: Dispatch<SetStateAction<ErrorTypes | null>>;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (errorMessage === null) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }

          setErrorMessage(null);
        }}
      />
      {errorMessage}
    </div>
  );
};
