import React from 'react';
import cn from 'classnames';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

interface Props {
  statusFilter: TodoStatusFilter;
  changeFilterStatus: (status: TodoStatusFilter) => void;
}

export const TodoFilter: React.FC<Props> = ({
  statusFilter,
  changeFilterStatus,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: statusFilter === TodoStatusFilter.All,
      })}
      onClick={() => changeFilterStatus(TodoStatusFilter.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: statusFilter === TodoStatusFilter.Active,
      })}
      onClick={() => changeFilterStatus(TodoStatusFilter.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: statusFilter === TodoStatusFilter.Completed,
      })}
      onClick={() => changeFilterStatus(TodoStatusFilter.Completed)}
    >
      Completed
    </a>
  </nav>
);
