/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  message: string,
};

export const Notification: React.FC<Props> = ({ message }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {message}
    </div>
  );
};
