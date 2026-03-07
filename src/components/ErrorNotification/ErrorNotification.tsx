import React from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage | null;
}

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
