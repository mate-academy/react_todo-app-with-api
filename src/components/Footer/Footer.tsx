import React from 'react';
import { FilterTodosBy } from '../../types/FilterTodosBy';
import cn from 'classnames';
interface Props {
  uncompletedTodosLength: number;
  filterBy: FilterTodosBy;
  setFilteredBy: (filterBy: FilterTodosBy) => void;
  completedTodosLenght: number;
  handleDeleteAllCompleted: () => void;
}
export const Footer: React.FC<Props> = props => {
  const {
    uncompletedTodosLength,
    filterBy,
    setFilteredBy,
    completedTodosLenght,
    handleDeleteAllCompleted,
  } = props;
  const basePath = '/react_todo-app-with-api';
  const filters = Object.values(FilterTodosBy);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter}
            href={`${basePath}/#/${filter !== FilterTodosBy.All && filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterBy === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilteredBy(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosLenght}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
