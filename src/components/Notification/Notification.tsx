import React from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  hideErrorNotifications: () => void;
  notificationMessage: Errors
};

export const Notification:React.FC<Props> = ({
  hideErrorNotifications,
  notificationMessage,
}) => {
  let message = '';

  switch (notificationMessage) {
    case Errors.Add:
    case Errors.Get:
    case Errors.Delete:
      message = `Unable to ${notificationMessage} a todo`;
      break;
    case Errors.EmptyTitle:
      message = 'Title can\'t be empty';
      break;
    default:
      message = '';
  }

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        aria-label="close notification"
        type="button"
        className="delete"
        onClick={() => hideErrorNotifications()}
      />
      {message}
    </div>
  );
};
