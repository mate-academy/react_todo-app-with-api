/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  errorMessage: string,
  timerId: NodeJS.Timeout,
  onErrorStatus: (errStatus: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  timerId,
  onErrorStatus,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onErrorStatus(false);
          clearTimeout(timerId);
        }}
      />

      {errorMessage}
    </div>
  );
};
