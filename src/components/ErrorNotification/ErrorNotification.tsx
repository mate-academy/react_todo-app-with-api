import React from 'react';
import cn from 'classnames';

type Props = {
  message: string;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onHide }) => {
  {
    /* DON'T use conditional rendering to hide the notification */
  }

  {
    /* Add the 'hidden' class to hide the message smoothly */
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
