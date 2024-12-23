/* eslint-disable prettier/prettier */
import React from 'react';
import cn from 'classnames';
import { Status } from '../types/Status';

type Props = {
  activeStatus: Status;
  completedTodos: number;
  notCompletedTodos: number;
  onDeleteAllCompleted: () => void;
  setActiveStatus: (status: Status) => void;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    activeStatus,
    completedTodos,
    notCompletedTodos,
    onDeleteAllCompleted,
    setActiveStatus,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            data-cy={`FilterLink${status}`}
            href={status === 'All' ? '#/' : `#/${status.toLowerCase()}`}
            className={cn('filter__link', {
              selected: activeStatus === status,
            })}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
