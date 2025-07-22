import cn from 'classnames';
import { useEffect } from 'react';
import { TodoError } from '../../types/Errors';

type Props = {
  errorMessage: TodoError | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  const ERROR_DURATION = 3000;

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, ERROR_DURATION);

    return () => clearTimeout(timerId);
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
