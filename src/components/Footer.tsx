import React from 'react';
import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';

type FilterType = 'all' | 'active' | 'completed';

interface TodoFooterProps {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  filterType,
  setFilterType,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <TodoFilter filterType={filterType} setFilterType={setFilterType} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
