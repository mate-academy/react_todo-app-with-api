import React from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import { StatusFilter } from '../StatusFilter';

type Props = {
  selectStatus: (status:TodoStatus)=> void;
  selectedStatus: TodoStatus;
  activeTodosCount: number;
  clearCompleted: () => void;
};

export const Footer:React.FC<Props> = ({
  selectStatus,
  selectedStatus,
  activeTodosCount,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <StatusFilter
        selectStatus={selectStatus}
        selectedStatus={selectedStatus}
      />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
