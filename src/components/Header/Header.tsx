import React, { FormEvent, memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

import './Header.scss';
import { ErrorMessages } from '../../types/Errors';

type Props = {
  todos: Todo[];
  onToggle: (toggledIds: number[], toggledTodos: Todo[]) => void;
  onAdding: (newTodoTitle: string) => Promise<void>;
  onError: (errorMessages: ErrorMessages) => void;
};

export const Header: React.FC<Props> = memo(function Header({
  todos,
  onToggle,
  onAdding,
  onError,
}) {
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const addTodoInput = addTodoInputRef.current;

  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!addTodoInput) {
      return;
    }

    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) {
      onError(ErrorMessages.Title);

      return;
    }

    addTodoInput.disabled = true;

    onAdding(trimmedTodo)
      .then(() => setNewTodo(''))
      .finally(() => {
        addTodoInput.disabled = false;
        addTodoInput.focus();
      });
  };

  const toggleHandle = () => {
    const toggledTodos = areAllTodosCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    onToggle(
      toggledTodos.map(({ id }) => id),
      todos.map(todo => ({
        ...todo,
        completed: !areAllTodosCompleted,
      })),
    );
  };

  useEffect(() => {
    addTodoInputRef.current?.focus();
  }, []);

  return (
    <header className="Header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('Header__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={toggleHandle}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={addTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="Header__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
      </form>
    </header>
  );
});
