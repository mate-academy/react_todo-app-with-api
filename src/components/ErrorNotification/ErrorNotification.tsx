import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
  onCloseErrorMessage: () => void;
  isError: boolean,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
  onCloseErrorMessage,
  isError,
}) => {
  setTimeout(() => setErrorMessage, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
          onCloseErrorMessage();
        }}
      />
      {errorMessage}
    </div>
  );
};
