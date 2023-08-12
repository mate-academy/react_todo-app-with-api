import { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/Error';

type Props = {
  error: ErrorMessage;
  onErrorChange: (error: ErrorMessage) => void;
};

export const TodoError: React.FC<Props> = ({ error, onErrorChange }) => {
  useEffect(() => {
    if (error) {
      window.setTimeout(() => {
        onErrorChange(ErrorMessage.None);
      }, 3000);
    }
  }, [error]);

  return (
    <div className={classNames('notification',
      'is-danger', 'is-light', 'has-text-weight-normal', {
        hidden: error === ErrorMessage.None,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onErrorChange(ErrorMessage.None)}
        aria-label="Clear error message"
      />
      {error}
    </div>
  );
};
