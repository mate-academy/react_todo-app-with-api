import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  removeErrorMessage: () => MouseEventHandler<HTMLButtonElement> | undefined
};

export const Notification: React.FC<Props>
= ({ errorMessage, removeErrorMessage }) => {
  return (
    <div className={classNames(
      'notification is-primary',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={removeErrorMessage}
        aria-label="Delete"
      />

      {errorMessage}
    </div>
  );
};
