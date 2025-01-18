import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';

type Props = {
  totalCount: number;
  activeCount: number;
  clearCompleted: () => void;

  currentFilter: Filter;
  setFilter: (newFilter: Filter) => void;
};

export const Footer: React.FC<Props> = React.memo(function Footer({
  totalCount,
  activeCount,
  clearCompleted,

  currentFilter,
  setFilter,
}) {
  const dataCy = ['FilterLinkAll', 'FilterLinkActive', 'FilterLinkCompleted'];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map((filter, i) => (
          <a
            key={filter}
            href="#/"
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={dataCy[i]}
            onClick={() => setFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={totalCount === activeCount}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
