import classNames from 'classnames';
import React from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  hideErrorNotifications: () => void;
  notificationMessage: Errors
  hasErrorNotification: boolean;
};

export const Notification:React.FC<Props> = ({
  hideErrorNotifications,
  notificationMessage,
  hasErrorNotification,
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
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !hasErrorNotification },
    )}
    >
      <button
        aria-label="close notification"
        type="button"
        className="delete"
        onClick={hideErrorNotifications}
      />
      {message}
    </div>
  );
};
