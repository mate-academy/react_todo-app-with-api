import classNames from 'classnames';
import React from 'react';

type Props = {
  errorType: string,
  hasError: boolean,
  handleError: (error: boolean) => void,
};

export const Notification: React.FC<Props> = React.memo(({
  errorType,
  hasError,
  handleError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        aria-label="delete-button"
        type="button"
        className="delete"
        onClick={() => handleError(false)}
      />

      {`${errorType}`}
    </div>
  );
});
