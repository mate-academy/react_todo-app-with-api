import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  hideError: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ error, hideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {error}
    </div>
  );
};
