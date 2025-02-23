import classNames from 'classnames';
import { useEffect } from 'react';

type ErrorNotificationProps = {
  errorNotification: string;
  setErrorNotification: (error: string) => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorNotification,
  setErrorNotification,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => setErrorNotification(''), 3000);

    return () => clearTimeout(timer);
  }, [errorNotification, setErrorNotification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorNotification },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorNotification('')}
      />
      {errorNotification}
    </div>
  );
};
