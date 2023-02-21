/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';

type Props = {
  hasActiveTodos: boolean,
  title: string,
  onTitleChange: (newTitle: string) => void,
  onAddTodo: (title: string) => void,
  isInputDisabled: boolean,
  handleUpdateAllTodosStatus: () => void,
  todos: Todo[],
  showError: (message: ErrorMessages) => void,
};

export const Header: React.FC<Props> = ({
  hasActiveTodos,
  title,
  onTitleChange,
  onAddTodo,
  isInputDisabled,
  handleUpdateAllTodosStatus,
  todos,
  showError,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preparedTitle = title.trim();

    if (preparedTitle.length === 0) {
      showError(ErrorMessages.TITLE);

      return;
    }

    onAddTodo(preparedTitle);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !hasActiveTodos },
          )}
          onClick={handleUpdateAllTodosStatus}
        />
      )}

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            onTitleChange(event.target.value);
          }}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
