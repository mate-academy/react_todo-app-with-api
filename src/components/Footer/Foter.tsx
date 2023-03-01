import classNames from 'classnames';
import React from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import { StatusFilter } from '../StatusFilter';

type Props = {
  selectStatus: (status:TodoStatus)=> void;
  selectedStatus: TodoStatus;
  activeTodosCount: number;
  complitedTodosCount: number;
  clearCompleted: () => void;
};

export const Footer:React.FC<Props> = ({
  selectStatus,
  selectedStatus,
  activeTodosCount,
  complitedTodosCount,
  clearCompleted,
}) => {
  const isVisible = Boolean(complitedTodosCount);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <StatusFilter
        selectStatus={selectStatus}
        selectedStatus={selectedStatus}
      />

      <button
        type="button"
        // className="todoapp__clear-completed"
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': !isVisible,
          },
        )}
        onClick={clearCompleted}
        disabled={!isVisible}
      >
        Clear completed
      </button>

    </footer>
  );
};
