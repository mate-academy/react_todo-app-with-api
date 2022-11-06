import { useEffect } from 'react';
import { Error } from '../../types/Error';

type Props = {
  handleError: (value: Error | null) => void;
  errorMessage: Error | null;
  setErrorMessage: (value: Error | null) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  handleError,
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => setErrorMessage(errorMessage),
      3000);

    return () => {
      window.clearInterval(timeout);
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
        aria-label="Hide Error"
        onClick={() => handleError(null)}
      />
      {errorMessage}
    </div>
  );
};
