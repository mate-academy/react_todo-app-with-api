import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  query: string,
  setQuery: (query: string) => void,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  isInputDisabled: boolean,
  todos: Todo[],
  updateAllTodoStatus: () => void,
}

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  handleSubmit,
  isInputDisabled,
  todos,
  updateAllTodoStatus,
}) => {
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: areAllTodosCompleted },
        )}
        onClick={updateAllTodoStatus}
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
