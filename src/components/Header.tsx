import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  loadingTodoIds: number[];
  inputRef: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  isAddingTodo: boolean;
  toggleAllTodos: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setNewTodoTitle: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  loadingTodoIds,
  inputRef,
  newTodoTitle,
  isAddingTodo,
  toggleAllTodos,
  handleSubmit,
  setNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && loadingTodoIds.length === 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isAddingTodo}
          autoFocus
        />
      </form>
    </header>
  );
};
