import React from 'react';
import cn from 'classnames';

import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  filter: TodoStatus;
  onFilterChange: (filter: TodoStatus) => void;
}

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: filter === TodoStatus.ALL,
      })}
      onClick={() => onFilterChange(TodoStatus.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: filter === TodoStatus.ACTIVE,
      })}
      onClick={() => onFilterChange(TodoStatus.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: filter === TodoStatus.COMPLETED,
      })}
      onClick={() => onFilterChange(TodoStatus.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
