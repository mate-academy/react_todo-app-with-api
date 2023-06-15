import React from 'react';
import cn from 'classnames';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';

interface Props {
  filterStatus: TodoFilterStatus;
  changeFilterStatus: (status: TodoFilterStatus) => void;
}

export const TodoFilter: React.FC<Props> = ({
  filterStatus,
  changeFilterStatus,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterStatus === TodoFilterStatus.All,
        })}
        onClick={() => changeFilterStatus(TodoFilterStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterStatus === TodoFilterStatus.Active,
        })}
        onClick={() => changeFilterStatus(TodoFilterStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === TodoFilterStatus.Completed,
        })}
        onClick={() => changeFilterStatus(TodoFilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
