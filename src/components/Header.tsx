import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    input: React.RefObject<HTMLInputElement>,
  ) => void;
  query: string;
  onQuery: (q: string) => void;
  todos: Todo[];
  loading: boolean;
  onTogglingTodos: () => void;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  query,
  onQuery,
  todos,
  loading,
  onTogglingTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            'active': todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onTogglingTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => onSubmit(event, inputRef)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQuery(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
