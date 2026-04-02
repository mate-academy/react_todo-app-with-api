import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | null>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light ${!errorMessage ? 'hidden' : ''}`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMessage(null)}
    />
    {errorMessage}
  </div>
);
