import React from 'react';
import classNames from 'classnames';

export const ErrorNotification = ({ message, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !message },
    )}
  >
    <button data-cy="HideErrorButton" className="delete" onClick={onClose} />
    {message}
  </div>
);
