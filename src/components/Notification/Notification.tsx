import React from 'react';
import classNames from 'classnames';

type Props = {
  visible: boolean,
  message: string,
  onClear: () => void,
};

export const Notification: React.FC<Props> = React.memo(
  ({
    visible,
    message,
    onClear,
  }) => (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !visible },
    )}
    >
      <button
        aria-label="Clear notification"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {message}
    </div>
  ),
);
