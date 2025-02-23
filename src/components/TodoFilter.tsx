import React, { FC } from 'react';
import { Status } from '../types/Status';
import cn from 'classnames';

type Props = {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  status: Status;
  onDeleteCompleted: () => void;
  totalTodosActive: number;
  hasTodoCompleted: number;
};

export const TodoFilter: FC<Props> = ({
  setStatus,
  status,
  totalTodosActive,
  hasTodoCompleted,
  onDeleteCompleted,
}) => {
  const links = Object.entries(Status);

  return (
    <footer className="todoapp__footer" data-cy="TodoFilter">
      <span className="todo-count" data-cy="TodosCounter">
        {totalTodosActive} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === Status.All ? '' : `${value}`}`}
            className={cn('filter__link', { selected: status === value })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => setStatus(value)}
          >
            {key}
          </a>
        ))}
      </nav>
      <button
        disabled={!hasTodoCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
