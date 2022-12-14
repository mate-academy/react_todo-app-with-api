/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';
import { ErrorContext } from '../ErrorContext/ErrorContext';

export const ErrorNotification: React.FC = () => {
  const timerRef = useRef<NodeJS.Timer>();
  const { error, setError } = useContext(ErrorContext);

  useEffect(() => {
    if (error !== ErrorTypes.NONE) {
      timerRef.current = setTimeout(() => {
        setError(ErrorTypes.NONE);
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorTypes.NONE },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(ErrorTypes.NONE);
        }}
      />
      {error}
    </div>
  );
};
