import classNames from 'classnames';
import React from 'react';

type Props = {
  isError: boolean;
  errorMessage: string;
  onError: (flag: boolean) => void;
};

export const Error: React.FC<Props> = ({ isError, errorMessage, onError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError(false)}
      />
      {errorMessage}
    </div>
  );
};
