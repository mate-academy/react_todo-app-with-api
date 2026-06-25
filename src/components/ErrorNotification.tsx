import React from 'react';
import { ErrorMessage } from '../types/Types';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (value: ErrorMessage) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
      />
      {errorMessage}
    </div>
  );
};
