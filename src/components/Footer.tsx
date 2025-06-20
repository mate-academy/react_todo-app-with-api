import { StatusFilter, StatusFilterOptions } from './StatusFilter';
import { Todo } from '../types/Todo';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  show: boolean;
  activeTodosAmount: number;
  completedTodos: Todo[];
  statusFilter: StatusFilterOptions;
  setStatusFilter: Dispatch<SetStateAction<StatusFilterOptions>>;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  show,
  activeTodosAmount,
  completedTodos,
  statusFilter,
  setStatusFilter,
  handleClearCompleted,
}) => {
  if (!show) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount} items left
      </span>

      <StatusFilter
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
