import React from 'react';
import cn from 'classnames';

type Props = {
  isError: boolean;
  onClose: () => void;
  errorText: string;
};

export const ErrorMessage: React.FC<Props> = React.memo(({
  isError, onClose, errorText,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        aria-label="Close error messages"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorText}
      <br />
    </div>
  );
});
