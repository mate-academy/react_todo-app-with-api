import React from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onHide }) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !message },
    )}
    data-cy="ErrorNotification"
  >
    <button
      type="button"
      className="delete"
      data-cy="HideErrorButton"
      onClick={onHide}
    />
    {message}
  </div>
);
