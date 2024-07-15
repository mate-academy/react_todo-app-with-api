import React, { useEffect } from 'react';
import { FC } from 'react';
import classNames from 'classnames';

type Props = {
  closeError: () => void;
  errorMessage: string;
};
export const Error: FC<Props> = ({ closeError, errorMessage }) => {
  useEffect(() => {
    const timeout = setTimeout(closeError, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage, closeError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {errorMessage}
    </div>
  );
};
