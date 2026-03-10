import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../../types/Error';

interface Props {
  errorType: ErrorType | null;
  setErrorType: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

export const Error: React.FC<Props> = ({ errorType, setErrorType }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorType },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(null)}
      />
      {errorType?.type}
    </div>
  );
};
