import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleAddTodo: () => void;
  toggleAllTodos: () => void;
  isLoading: boolean;
  todos: Todo[];
  shouldFocusCreationForm: boolean;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  toggleAllTodos,
  isLoading,
  todos,
  shouldFocusCreationForm,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [shouldFocusCreationForm]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !isLoading && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
