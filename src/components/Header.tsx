import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  newTodoTitle: string;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: (e: React.FormEvent) => void;
  handleCompleteAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  newTodoTitle,
  isAdding,
  inputRef,
  setNewTodoTitle,
  handleAddTodo,
  handleCompleteAll,
}) => {
  const activeCount = todos.filter(todo => todo.completed === false);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={handleCompleteAll}
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            activeCount.length === 0 && 'active',
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
