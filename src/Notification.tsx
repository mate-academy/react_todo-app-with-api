import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Emessage } from './types/Emessage';

interface Props {
  errMessage: Emessage;
  closingErrMessage: () => void;
}

export const Notification: React.FC<Props> = ({
  errMessage,
  closingErrMessage,
}) => {
  useEffect(() => {
    if (errMessage === Emessage.null) {
      return;
    }

    const timer = setTimeout(() => {
      closingErrMessage();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errMessage, closingErrMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: errMessage === Emessage.null,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closingErrMessage}
      />
      {errMessage}
    </div>
  );
};
