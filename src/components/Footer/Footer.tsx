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

  const filters = useMemo(() => Object.values(Filter), []);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {filters.map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames(
              'filter__link',
              { selected: filterBy === filter },
            )}
            onClick={handleFilterClick(filter as Filter)}
          >
            {filter}
          </a>
        ))}
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
