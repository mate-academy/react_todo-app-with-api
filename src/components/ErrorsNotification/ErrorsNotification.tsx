import React from 'react';
import classNames from 'classnames';

import { ErrorType } from '../../types/ErrorType';
import { generateErrorMessage } from '../../api/todos';

type Props = {
  hasError: boolean,
  errorType: ErrorType,
  onHasError: (isError: boolean) => void,
};

export const ErrorsNotification:React.FC<Props> = ({
  hasError,
  errorType,
  onHasError,
}) => {
  const errorMessage = generateErrorMessage(errorType);
  const handleDeleteClick = () => {
    onHasError(false);
  };

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        type="button"
        aria-label="delete button"
        className="delete"
        onClick={handleDeleteClick}
      />
      {errorMessage}
    </div>
  );
};
