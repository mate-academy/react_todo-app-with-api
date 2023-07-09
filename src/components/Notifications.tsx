import { FC, useEffect } from 'react';

interface NotificationsProps {
  onClose: () => void,
  errorMessage: string,
}

export const Notifications: FC<NotificationsProps> = (props) => {
  const { onClose, errorMessage } = props;

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      <p>{errorMessage}</p>
    </div>
  );
};
