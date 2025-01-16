import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  newTodo: string;
  setNewTodo: (value: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  todos: Todo[];
}

export const Header: React.FC<HeaderProps> = ({
  newTodo,
  setNewTodo,
  handleAddTodo,
  isLoading,
  inputRef,
  handleToggleAll,
  todos,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <input
          type="checkbox"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onChange={handleToggleAll}
          checked={false}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
