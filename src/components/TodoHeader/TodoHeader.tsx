import React from 'react';
import cn from 'classnames';

type Props = {
  hasTodos: boolean;
  allTodosCompleted: boolean;
  handleToggleAll: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  query: string;
  setQuery: (value: string) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader = ({
  hasTodos,
  allTodosCompleted,
  handleToggleAll,
  handleSubmit,
  query,
  setQuery,
  isAdding,
  inputRef,
}: Props) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          autoFocus
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
