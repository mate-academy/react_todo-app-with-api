import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string,
  isError: boolean,
  closeError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isError,
  closeError,
}) => (
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
        closeError();
      }}
    />
    {errorMessage}
  </div>
);
