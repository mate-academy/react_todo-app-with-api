import React from 'react';
import { TodoFilter } from '../TodoFilter';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

interface Props {
  statusFilter: TodoStatusFilter;
  changeFilterStatus: (status: TodoStatusFilter) => void;
  clearCompleted: () => void;
  activeTodosLeft: number;
  isClearCompletedVisible: boolean;
}

export const TodoFooter: React.FC<Props> = ({
  statusFilter,
  changeFilterStatus,
  clearCompleted,
  activeTodosLeft,
  isClearCompletedVisible,
}) => {
  const handleClearCompletedOnClick = () => clearCompleted();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLeft} items left`}
      </span>

      <TodoFilter
        statusFilter={statusFilter}
        changeFilterStatus={changeFilterStatus}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isClearCompletedVisible}
        onClick={handleClearCompletedOnClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
