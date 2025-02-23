import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { NotificationProps } from '../../types/NotificationProps';

export const Notification: React.FC<NotificationProps> = ({
  error,
  setError,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: number;

    if (error) {
      setIsVisible(true);
      timer = window.setTimeout(() => {
        setIsVisible(false);
        // setError('');
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsVisible(false)}
      />
      {error}
    </div>
  );
};
