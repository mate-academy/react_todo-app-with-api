import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onCloseErrorMessage: (val: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
