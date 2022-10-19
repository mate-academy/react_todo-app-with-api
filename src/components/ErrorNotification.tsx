import classNames from 'classnames';
import React from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

interface Props {
  error: ErrorTypes | null;
  changeError: (value: ErrorTypes | null) => void;
}

const ErrorNotification:React.FC<Props> = (
  { error, changeError },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        aria-label="ideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeError(null)}
      />

      {error}
    </div>
  );
};

export default ErrorNotification;
