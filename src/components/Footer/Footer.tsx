import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: Filter,
  onFilterBy: (filterBy: Filter) => void,
  onDeleteCopletedTodos: () => void,
};

export const Footer:React.FC<Props> = ({
  todos,
  filterBy,
  onFilterBy,
  onDeleteCopletedTodos,
}) => {
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const activeTodosCount = activeTodos.length;
  const isCompletedTodos = todos.some(todo => todo.completed);

  const isButtonActive = {
    opacity: isCompletedTodos
      ? 1
      : 0,
  };

  const handleFilterClick = (status: Filter) => (event: React.MouseEvent) => {
    onFilterBy(status);
    event.preventDefault();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/all"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.ALL },
          )}
          onClick={handleFilterClick(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.ACTIVE },
          )}
          onClick={handleFilterClick(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.COMPLETED },
          )}
          onClick={handleFilterClick(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={isButtonActive}
        onClick={onDeleteCopletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
