import React, { useEffect, useMemo } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
import { errorString } from '../ErrorString/ErrorString';

type Props = {
  errorMessage: ErrorMessage;
  onClose: () => void;
};

export const Error: React.FC<Props> = ({ errorMessage, onClose }) => {
  const error = useMemo(() => errorString(errorMessage), [errorMessage]);

  useEffect(() => {
    const errorTimeOut = setTimeout(() => onClose(), 3000);

    return () => {
      clearTimeout(errorTimeOut);
    };
  }, []);

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
      hidden={errorMessage === ErrorMessage.None}
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="Close error message"
      />

      {error}
    </div>
  );
};
