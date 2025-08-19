import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMsg: string | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ errorMsg, onClose }) => {
  const hidden = !errorMsg;

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
      style={{ display: hidden ? 'none' : 'block', marginBottom: 0 }}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMsg}
    </div>
  );
};
