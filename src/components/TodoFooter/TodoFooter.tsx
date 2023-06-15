import React from 'react';
import { TodoFilter } from '../TodoFilter';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';

interface Props {
  filterStatus: TodoFilterStatus;
  changeFilterStatus: (status: TodoFilterStatus) => void;
  clearCompleted: () => void;
  activeTodosLeft: number;
  isClearCompletedVisible: boolean;
}

export const TodoFooter: React.FC<Props> = ({
  filterStatus,
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
        filterStatus={filterStatus}
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
