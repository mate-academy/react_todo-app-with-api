import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { chooseTheError } from '../../utils/chooseTheError';

type Props = {
  typeOfError: ErrorMessages,
  setMessage: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ typeOfError, setMessage }) => (
  <div className="notification is-danger is-light has-text-weight-normal">
    <button
      type="button"
      className="delete"
      onClick={setMessage}
      aria-label="Close error"
    />
    {chooseTheError(typeOfError)}
  </div>
);
