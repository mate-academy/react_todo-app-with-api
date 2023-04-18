import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface NotificationPropsType {
  hasErrorFromServer: boolean,
  clearNotification: () => void,
  errorMessage: string,
}

export const Notification: React.FC<NotificationPropsType> = ({
  hasErrorFromServer,
  clearNotification,
  errorMessage,
}) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (hasErrorFromServer) {
      setHidden(false);
      timerId = setTimeout(() => {
        setHidden(true);
        clearNotification();
      }, 3000);
    } else {
      setHidden(true);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [hasErrorFromServer, clearNotification]);

  return (
    <div className={classNames(
      'notification is-danger is-light',
      { hidden },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Add todo"
        onClick={clearNotification}
      />

      {errorMessage}
      <br />
    </div>
  );
};
