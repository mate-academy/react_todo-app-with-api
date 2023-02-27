import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  hasError: boolean,
  errorMessage: ErrorMessage,
  onClear: () => void,
};

export const Notification: React.FC<Props> = ({
  hasError,
  errorMessage,
  onClear,
}) => {
  useEffect(() => {
    setTimeout(onClear, 3000);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        aria-label="delete button"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {errorMessage}
    </div>
  );
};
