import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  activeTodosCount: number;
  loading: boolean;
  field: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleAddTodo: (event: React.FormEvent) => void;
  setTodoTitle: (title: string) => void;
  toggleAll: boolean;
  handleToggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  loading,
  field,
  todoTitle,
  handleAddTodo,
  setTodoTitle,
  toggleAll,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${toggleAll ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          disabled={loading || todos.length === 0}
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={field}
          value={todoTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
