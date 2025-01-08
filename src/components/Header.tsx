import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  addTodo: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  todos: Todo[];
  toggleAllTodos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
  isInputDisabled,
  todos,
  toggleAllTodos,
}) => {
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={toggleAllTodos}
          data-cy="ToggleAllButton"
        ></button>
      )}

      <form onSubmit={addTodo}>
        <input
          ref={newTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
