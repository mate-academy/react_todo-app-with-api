import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onCloseErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorMessage: React.FC<Props> = memo((props) => {
  const { errorMessage, onCloseErrorMessage } = props;

  if (errorMessage) {
    setTimeout(() => {
      onCloseErrorMessage('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
});
