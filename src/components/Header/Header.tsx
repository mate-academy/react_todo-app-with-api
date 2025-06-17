import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorNotificationMessage } from '../../types/ErrorNotificationMessage';
import { useHeader } from '../../hooks/useHeader';

interface HeaderProps {
  isLoadingTodos: boolean;
  isActive: boolean;
  newTitle: string;
  todosLength: number;
  onChangeNewTitle: (newTitle: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onErrorMessage: (errorMessage: ErrorNotificationMessage) => void;
  onChangeAllTodos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoadingTodos,
  isActive,
  newTitle,
  todosLength,
  onChangeNewTitle,
  addTodo,
  onErrorMessage,
  onChangeAllTodos,
}) => {
  const { isDisabledInput, inputRef, onSubmit } = useHeader({
    newTitle,
    onChangeNewTitle,
    addTodo,
    onErrorMessage,
    todosLength,
  });

  return (
    <header className="todoapp__header">
      {!isLoadingTodos && todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={onChangeAllTodos}
        />
      )}

      <form method="POST" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => onChangeNewTitle(event.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
