import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  showError: boolean;
  hasTitleError: boolean;
  unableToLoadTodos: boolean;
  unableToAddTodo: boolean;
  unableToUpdateTodo: boolean;
  unableToDeleteTodo: boolean;
  onClearErrors: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  showError,
  hasTitleError,
  unableToLoadTodos,
  unableToAddTodo,
  unableToUpdateTodo,
  unableToDeleteTodo,
  onClearErrors,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !showError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClearErrors}
      />
      {unableToLoadTodos && <p>Unable to load todos</p>}
      {hasTitleError && <p>Title should not be empty</p>}
      {unableToAddTodo && <p>Unable to add a todo</p>}
      {unableToDeleteTodo && <p>Unable to delete a todo</p>}
      {unableToUpdateTodo && <p>Unable to update a todo</p>}
    </div>
  );
};
