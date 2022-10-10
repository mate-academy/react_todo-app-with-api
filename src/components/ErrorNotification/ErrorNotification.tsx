import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  error: string | null,
  setError: (error: ErrorMessage) => void,
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  const [hideError, setHideError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setError(ErrorMessage.None), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, hideError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !hideError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHideError(true)}
        aria-label="Hide error"
      />
      {error}
    </div>
  );
};
