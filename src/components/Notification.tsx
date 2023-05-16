import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorType: ErrorType,
};

export const Notification: React.FC<Props> = ({ errorType }) => {
  const [isNotificationHidden, setisNotificationHidden] = useState(false);
  const hideNotification = () => {
    setisNotificationHidden(true);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isNotificationHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={hideNotification}
      >
        x
      </button>
      {errorType}
    </div>
  );
};
