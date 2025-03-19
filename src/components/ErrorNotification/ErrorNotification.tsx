import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMsg: string | null;
  handleCloseErrorButton: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMsg,
  handleCloseErrorButton,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMsg },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseErrorButton}
      />
      {errorMsg}
    </div>
  );
};
