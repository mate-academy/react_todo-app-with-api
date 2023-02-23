import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  typeOfError: ErrorMessages,
  setMessage: () => void,
};

export const ErrorMessage: React.FC<Props> = ({ typeOfError, setMessage }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={setMessage}
        aria-label="Close error"
      />

      {typeOfError === ErrorMessages.LOAD && (
        'Unable to load todos'
      )}

      {typeOfError === ErrorMessages.TITLE && (
        'Title can\'t be empty'
      )}

      {typeOfError === ErrorMessages.ADD && (
        'Unable to add the todo'
      )}

      {typeOfError === ErrorMessages.DELETE && (
        'Unable to delete the todo'
      )}

      {typeOfError === ErrorMessages.DELETE_COMPLETED && (
        'nable to delete completed todos'
      )}

      {typeOfError === ErrorMessages.UPDATE && (
        'Unable to update a todo'
      )}

      {typeOfError === ErrorMessages.UPDATE_ALL && (
        'Unable to update status of todos'
      )}
    </div>
  );
};
