import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { FilterValue } from '../types/Filters';

type Props = {
  setFilter: (filter: FilterValue) => void;
  filter: FilterValue;
  todos: Todo[];
  handleDelete: (id: number | undefined) => void;
  activeCount: number;
};

const FILTER_TITLES: Record<FilterValue, string> = {
  [FilterValue.All]: 'All',
  [FilterValue.Active]: 'Active',
  [FilterValue.Completed]: 'Completed',
};

export const Filter: React.FC<Props> = ({
  setFilter,
  filter,
  todos,
  handleDelete,
  activeCount,
}) => {
  const filterValues = Object.values(FilterValue) as FilterValue[];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterValues.map(value => (
          <a
            href={`#/${value.toLowerCase()}`}
            key={value}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${FILTER_TITLES[value]}`}
            onClick={() => setFilter(value)}
          >
            {FILTER_TITLES[value]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleDelete(undefined)}
        disabled={activeCount === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
