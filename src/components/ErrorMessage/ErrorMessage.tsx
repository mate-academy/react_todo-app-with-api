import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (error: string) => void
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timerId = setInterval(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="error"
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
