import classNames from 'classnames';
import { useEffect } from 'react';

type ErrorMessageProps = {
  errorMessage: string;
  setErrorMessage: (error: string) => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
