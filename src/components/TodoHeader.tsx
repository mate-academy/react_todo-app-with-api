import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  activeTodos: Todo[];
  loading: boolean;
  newTitle: string;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddTodo: (e: React.FormEvent) => void;
  handleToggleAllTodos: () => void;
  setNewTitle: (value: string) => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  activeTodos,
  loading,
  newTitle,
  isAdding,
  inputRef,
  handleAddTodo,
  handleToggleAllTodos,
  setNewTitle,
}) => {
  return (
    <header className="todoapp__header">
      {!loading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${
            activeTodos.length === 0 ? 'active' : ''
          }`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          ref={inputRef}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
