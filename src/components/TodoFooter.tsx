import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { TodoFilter } from './TodoFilter';

type Props = {
  activeTodosCount: number;
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <TodoFilter filter={filter} onFilterChange={onFilterChange} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
