/* eslint-disable prettier/prettier */
import classNames from 'classnames';
import React from 'react';

interface ErrorInterface {
  errorState: string;
  setStateError: React.Dispatch<React.SetStateAction<string>>;
}

export const ErrorNotification: React.FC<ErrorInterface> = ({
  errorState,
  setStateError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification is-danger is-light', {
        'hidden': !errorState,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setStateError('')}
      />
      {errorState}
    </div>
  );
};
