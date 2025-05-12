import React from 'react';
import classNames from 'classnames';
import { TypeFilter } from '../types/TypeFilter';

type TodoFooterProps = {
  currentFilter: TypeFilter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<TypeFilter>>;
  activeCount: number;
  hasCompleted: boolean;
  clearCompletedTodos: () => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  currentFilter,
  setCurrentFilter,
  activeCount,
  hasCompleted,
  clearCompletedTodos,
}) => {
  const itemText = activeCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {itemText} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TypeFilter).map(filterType => (
          <a
            href={`#/${filterType}`}
            key={filterType}
            className={classNames('filter__link', {
              selected: filterType === currentFilter,
            })}
            data-cy={`FilterLink${filterType}`}
            onClick={() => setCurrentFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
