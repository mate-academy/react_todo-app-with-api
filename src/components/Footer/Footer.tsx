import React from 'react';
import { Filter } from '../Filter';
import { Filter as FilterType } from '../../types/Filter';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  selectedFilter,
  onFilterChange,
  onDeleteCompletedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
    </span>

    <Filter selectedFilter={selectedFilter} onFilterChange={onFilterChange} />

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={onDeleteCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
