import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  setFilter: (filter: Filter) => void
  removeCompletedTodos: () => void,
  currentFilter: Filter
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  removeCompletedTodos: removeCompleted,
  currentFilter,
}) => {
  const isCompletedTodos = todos.some(todo => todo.completed);

  const activeTodosCount = (
    todos.length - todos.filter(
      item => item.completed,
    ).length);

  const removeCompletedTodos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    removeCompleted();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.All },
            )
          }
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.Active },
            )
          }
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.Completed },
            )
          }
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={(event) => removeCompletedTodos(event)}
        disabled={!isCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
