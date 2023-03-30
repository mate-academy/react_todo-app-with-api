import React from 'react';
import { FilterType } from '../../types/FilterType';
import { FilterLink } from '../FilterLink';

type Props = {
  remainingTodos: number,
  filterType: FilterType,
  setFilterType: (type: FilterType) => void,
  completedTodos: number,
  onDeleteCompleted: () => void
};

export const Footer: React.FC<Props> = ({
  remainingTodos,
  filterType,
  setFilterType,
  completedTodos,
  onDeleteCompleted,
}) => {
  const todosInCountTitle = remainingTodos === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${remainingTodos} ${todosInCountTitle} left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(type => (
          <FilterLink
            type={type}
            currentType={filterType}
            setCurrentType={setFilterType}
          />
        ))}
      </nav>

      {completedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
