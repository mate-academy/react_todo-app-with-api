import React, { useCallback } from 'react';
import classNames from 'classnames';

type Props = {
  handleCloseButton: () => void,
  errorMessage: string,
  hasError: boolean,
};

export const TodoNotification: React.FC<Props> = React.memo(({
  handleCloseButton,
  errorMessage,
  hasError,
}) => {
  const handleClose = useCallback(() => {
    handleCloseButton();
  }, [handleCloseButton]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleClose}
      />

      <span>{errorMessage}</span>
    </div>
  );
});
