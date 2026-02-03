import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
import { useEffect } from 'react';

type Props = {
  error: ErrorMessage;
  setError: (value: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorMessage.None)}
      />
      {error}
    </div>
  );
};
