import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
type Props = {
  onQuery: (query: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  query: string;
  onToggleAll: () => void;
  completed: () => boolean;
  todos: Todo[];
};
export const Header: React.FC<Props> = ({
  onQuery,
  loading,
  inputRef,
  onSubmit,
  query,
  onToggleAll,
  completed,
  todos,
}) => {
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [inputRef, loading]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!loading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: completed() })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          onSubmit(event);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQuery(event.target.value)}
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};
