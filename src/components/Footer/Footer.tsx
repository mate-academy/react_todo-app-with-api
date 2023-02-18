import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types';

type Props = {
  activeTodosCount: number,
  filterType: FilterBy,
  setFilter: (filterType: FilterBy) => void,
  isClearButtonVisible: boolean,
  onDeleteCompleted: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filterType,
    setFilter,
    activeTodosCount,
    isClearButtonVisible,
    onDeleteCompleted,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterType === FilterBy.ALL },
          )}
          onClick={() => setFilter(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterType === FilterBy.ACTIVE },
          )}
          onClick={() => setFilter(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterType === FilterBy.COMPLETED },
          )}
          onClick={() => setFilter(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isClearButtonVisible}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  ),
);
