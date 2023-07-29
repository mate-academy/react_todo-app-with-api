import { FC, useEffect } from 'react';

interface NotificationsProps {
  onClose: () => void,
  errorMessage: string,
}

export const Notifications
: FC<NotificationsProps> = ({ onClose, errorMessage }) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        aria-label="closeNotification"
        className="delete"
        onClick={onClose}
      />
      <p>{errorMessage}</p>
    </div>
  );
};
