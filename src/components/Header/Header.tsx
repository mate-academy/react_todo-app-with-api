/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorNotification } from '../../types/ErrorNotification';

type Props = {
  todos: Todo[],
  search: string,
  setSearch: (query: string) => void,
  addTodo: () => void,
  setErrorNotification: (error: ErrorNotification) => void,
  selectAllTodos: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  search,
  setSearch,
  addTodo,
  setErrorNotification,
  selectAllTodos,
}) => {
  const isActive = todos.filter(todo => !todo.completed).length;
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (search.trim() === '') {
      setErrorNotification(ErrorNotification.TITLE);
    } else {
      addTodo();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive !== 0 },
        )}
        onClick={selectAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>
    </header>
  );
};
