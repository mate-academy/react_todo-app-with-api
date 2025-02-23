import React from 'react';
import { ErrorMessages } from '../App';

type Props = {
  error: ErrorMessages;
  setError: React.Dispatch<React.SetStateAction<ErrorMessages>>;
};

function ErrorComp({ error, setError }: Props) {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error === ErrorMessages.Empty ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorMessages.Empty)}
      />
      {error}
    </div>
  );
}

export default ErrorComp;
