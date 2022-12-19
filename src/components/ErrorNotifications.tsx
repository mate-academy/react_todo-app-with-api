import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Notifications } from '../types/Notifications';

interface Props {
  notification: Notifications,
  setNotification: (value: Notifications) => void,
}

export const ErrorNotification:React.FC<Props> = ({
  notification,
  setNotification,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setNotification(Notifications.None);
    }, 3000);
  }, [notification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !notification },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setNotification(Notifications.None)}
      />
      {notification}
    </div>
  );
};
