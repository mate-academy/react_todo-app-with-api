import cn from 'classnames';
import React, { useMemo } from 'react';
import { Filter } from '../../types/Filter';

interface Props {
  currentFilter: Filter,
  numberOfActive: number,
  hasCompleted: boolean,
  onFilterSelection: (value: Filter) => void,
  onClearCompleted: () => void;
}

export const Footer:React.FC<Props> = React.memo(({
  currentFilter,
  numberOfActive,
  hasCompleted,
  onFilterSelection,
  onClearCompleted,
}) => {
  const filters = useMemo(() => Object.values(Filter), []);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActive} items left`}
      </span>

      <nav className="filter">
        {filters.map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={cn('filter__link', {
              selected: filter === currentFilter,
            })}
            onClick={() => onFilterSelection(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={onClearCompleted}
        className={cn('todoapp__clear-completed', {
          'hidden-button': hasCompleted,
        })}
      >
        Clear completed
      </button>

    </footer>
  );
});
