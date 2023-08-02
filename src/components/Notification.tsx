import { useEffect } from 'react';
import cn from 'classnames';
import { ErrorType } from '../types/Error';

type Props = {
  error: ErrorType;
  closeError: (error: ErrorType) => void;
};

export const Notification: React.FC<Props> = ({ error, closeError }) => {
  useEffect(() => {
    setTimeout(() => {
      closeError(ErrorType.None);
    }, 3000);
  }, [error]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorType.None,
      })}
    >
      <button
        type="button"
        className="delete"
        id="deleteButton"
        onClick={() => closeError(ErrorType.None)}
      >
        Delete
      </button>
      {error}

    </div>
  );
};
