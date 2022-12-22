/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string,
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMessage, onErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        onErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
});
