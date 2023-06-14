import React from 'react';
import cn from 'classnames';

import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  filter: TodoStatus;
  onChangeFilter: (filter: TodoStatus) => void;
}

export const Filter: React.FC<Props> = ({ filter, onChangeFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === TodoStatus.ALL,
        })}
        onClick={() => onChangeFilter(TodoStatus.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === TodoStatus.ACTIVE,
        })}
        onClick={() => onChangeFilter(TodoStatus.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === TodoStatus.COMPLETED,
        })}
        onClick={() => onChangeFilter(TodoStatus.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
