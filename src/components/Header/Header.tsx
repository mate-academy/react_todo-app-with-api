import React from 'react';
import classNames from 'classnames';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  allTodosAreCompleted: boolean;
  onToggleAllTodos: () => Promise<void>;
  todosLength: number;
  isLoadingTodos: boolean;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAddTodo,
  isAdding,
  inputRef,
  allTodosAreCompleted,
  onToggleAllTodos,
  todosLength,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllTodos}
          disabled={isAdding}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
