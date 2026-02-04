import cn from 'classnames';

import React from 'react';
import { Filters, FILTERS_LIST } from '../types/Filters';

type FooterProps = {
  filterField: Filters;
  completedItemsCount: number;
  activeItemsCount: number;
  onChangeFilter: (filterBy: Filters) => void;
  onClear: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  filterField,
  completedItemsCount,
  activeItemsCount,
  onChangeFilter,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItemsCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS_LIST.map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={cn('filter__link', {
              selected: filter === filterField,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onChangeFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClear}
        disabled={completedItemsCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
