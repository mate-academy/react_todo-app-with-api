import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  toggleAll: () => void,
  handleSubmit: (event: React.FormEvent) => void,
  query: string,
  setQuery: (value: React.SetStateAction<string>) => void,
  disabledInput: boolean,
}

export const Header: React.FC<Props> = ({
  todos,
  toggleAll,
  handleSubmit,
  query,
  setQuery,
  disabledInput,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      aria-label="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: todos.every(todo => todo.completed) },
      )}
      onClick={toggleAll}
    />

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={disabledInput}
      />
    </form>
  </header>
);
