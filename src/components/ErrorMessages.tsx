import React from 'react';

interface Props {
  message: string,
  deleteErrorMessage: string,
  isThereIssue: boolean,
  editTodo: string,
  setIsThereIssue: (value: boolean) => void,
  isTitleEmpty: string,
}

export const ErrorMessages: React.FC<Props> = ({
  message,
  deleteErrorMessage,
  isThereIssue,
  editTodo,
  setIsThereIssue,
  isTitleEmpty,
}) => {
  return (
    <>
      {isThereIssue && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            type="button"
            className="delete"
            onClick={() => setIsThereIssue(false)}
            aria-label="Close error message."
          />
          {message}
          <br />
          {isTitleEmpty}
          <br />
          {deleteErrorMessage}
          <br />
          {editTodo}
        </div>
      )}
    </>
  );
};
