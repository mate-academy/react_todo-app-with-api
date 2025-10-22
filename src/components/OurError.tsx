import classNames from 'classnames';
import React from 'react';
import { NotificationErrors } from '../types/Errors';

type Props = {
  notificationError: NotificationErrors | null;
  setNotificationError: React.Dispatch<
    React.SetStateAction<NotificationErrors | null>
  >;
};

export const OurErrors: React.FC<Props> = ({
  notificationError,
  setNotificationError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !notificationError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setNotificationError(null)}
      />
      {notificationError}
    </div>
  );
};
