/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction } from 'react';
import cN from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: Error;
  setErrorMessage: Dispatch<SetStateAction<Error>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cN('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === Error.Default,
      })}
    >
      <button
        onClick={() => setErrorMessage(Error.Default)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {/* show only one message at a time +++*/}
      {errorMessage}
    </div>
  );
};
