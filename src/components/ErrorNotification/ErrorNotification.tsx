import cn from 'classnames';
import { ERROR_MESSAGE_DISAPPEARS_AFTER } from '../../constants/errorMessages';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification = ({ errorMessage, onClose }: Props) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(onClose, ERROR_MESSAGE_DISAPPEARS_AFTER);

    return () => clearTimeout(timer);
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
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
