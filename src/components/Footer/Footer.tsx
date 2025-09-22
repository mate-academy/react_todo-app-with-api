import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todosLeft: number;
  hasCompleted: boolean;
  clearCompleted: () => void;
};

const FILTER_LABELS: Record<Filter, string> = {
  [Filter.All]: 'All',
  [Filter.Active]: 'Active',
  [Filter.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todosLeft,
  hasCompleted,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todosLeft} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(option => (
        <a
          key={option}
          href={`#/${option === Filter.All ? '' : option}`}
          className={classNames('filter__link', {
            selected: filter === option,
          })}
          data-cy={`FilterLink${FILTER_LABELS[option]}`}
          onClick={e => {
            e.preventDefault();
            setFilter(option);
          }}
        >
          {FILTER_LABELS[option]}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
