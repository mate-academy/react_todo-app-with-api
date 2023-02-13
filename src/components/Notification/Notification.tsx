import cn from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  message: string,
  hidden: boolean,
  setHideNotification: Dispatch<SetStateAction<boolean>>,
};

export const Notification: React.FC<Props> = ({
  message,
  hidden,
  setHideNotification,
}) => {
  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setHideNotification(true)}
      />
      {message}
    </div>
  );
};
