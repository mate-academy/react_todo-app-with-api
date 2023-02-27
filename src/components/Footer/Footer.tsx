import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  selectedFilter: FilterType;
  handleFilterChange: (filter: FilterType) => void;
  isCompleted: boolean;
  deleteCompletedTodos: () => void;
  countOfActive: number;
};

export const Footer: React.FC<Props> = React.memo(({
  selectedFilter,
  handleFilterChange,
  isCompleted,
  deleteCompletedTodos,
  countOfActive,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${countOfActive} items left`}
    </span>

    <nav className="filter">
      {(Object.keys(FilterType) as Array<FilterType>).map(type => {
        return (
          <a
            key={type}
            href="#/"
            className={cn(
              'filter__link',
              { selected: selectedFilter === type },
            )}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </a>
        );
      })}
    </nav>

    <button
      type="button"
      className={cn(
        'todoapp__clear-completed',
        { hidden: !isCompleted },
      )}
      onClick={deleteCompletedTodos}
    >
      Clear compleated
    </button>

  </footer>
));
