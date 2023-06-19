import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorNotification } from '../../types/ErrorNotification';

type Props = {
  errorNotification: ErrorNotification,
  closeError: () => void,
};

export const TodoError: React.FC<Props> = ({
  errorNotification,
  closeError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      closeError();
    }, 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorNotification },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      >
        x
      </button>

      <>{errorNotification}</>
    </div>
  );
};
