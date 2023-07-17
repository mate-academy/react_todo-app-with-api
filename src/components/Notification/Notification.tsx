import React from 'react';
import cn from 'classnames';

interface NotificationProps {
  error: string | null;
  onCloseNotifications: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  error,
  onCloseNotifications,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseNotifications}
        aria-label="Close Notifications"
      />
      {error}
    </div>
  );
};
