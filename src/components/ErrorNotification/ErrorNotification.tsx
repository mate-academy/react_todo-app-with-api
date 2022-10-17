import { useEffect, memo } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  onErrorMessage: (errorType: ErrorMessage) => void;
  errorMessage: ErrorMessage,
};

export const ErrorNotification: React.FC<Props> = memo(({
  onErrorMessage,
  errorMessage,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => onErrorMessage(ErrorMessage.none), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close notification"
        onClick={() => onErrorMessage(ErrorMessage.none)}
      />

      {errorMessage}
    </div>
  );
});
