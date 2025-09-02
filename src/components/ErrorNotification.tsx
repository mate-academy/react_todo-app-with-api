import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onHide }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
    {error}
  </div>
);
