import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorNotification } from '../../types/ErrorNotification';

type Props = {
  errorNotification: ErrorNotification,
  setErrorNotification: (error: ErrorNotification) => void,
};

export const TodoError: React.FC<Props> = ({
  errorNotification,
  setErrorNotification,
}) => {
  useEffect(() => {
    const closeNotification = setTimeout(() => {
      setErrorNotification(ErrorNotification.NONE);
    }, 3000);

    return () => clearTimeout(closeNotification);
  }, [errorNotification]);

  const handleCloseError = () => {
    setErrorNotification(ErrorNotification.NONE);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: ErrorNotification.NONE },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      >
        x
      </button>

      <>{errorNotification}</>
    </div>
  );
};
