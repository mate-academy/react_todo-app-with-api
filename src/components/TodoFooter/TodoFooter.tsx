import React from 'react';
import { TodoCompletionType } from '../../types/TodoCompletionType';
import { FilterButton } from '../FilterButton';

type Props = {
  filterType: TodoCompletionType;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterSelect: (newFilterOption: TodoCompletionType) => void
  onCompletedTodosDelete: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterType,
  onFilterSelect,
  activeTodosCount,
  hasCompletedTodos,
  onCompletedTodosDelete,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter">
      <FilterButton
        filterOption={TodoCompletionType.All}
        isSelected={TodoCompletionType.All === filterType}
        onFilterSelect={onFilterSelect}
      />

      <FilterButton
        filterOption={TodoCompletionType.Active}
        isSelected={TodoCompletionType.Active === filterType}
        onFilterSelect={onFilterSelect}
      />

      <FilterButton
        filterOption={TodoCompletionType.Completed}
        isSelected={TodoCompletionType.Completed === filterType}
        onFilterSelect={onFilterSelect}
      />
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!hasCompletedTodos}
      onClick={onCompletedTodosDelete}
    >
      Clear completed
    </button>
  </footer>
);
