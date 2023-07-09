import React from 'react';
import cn from 'classnames';

import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  filterType: TodoStatus;
  onChangeFilter: (filter: TodoStatus) => void;
}

export const TodoFilter: React.FC<Props> = ({ filterType, onChangeFilter }) => {
  return (
    <nav className="filter">
      {Object.values(TodoStatus).map((status) => (
        <a
          key={status}
          href={`#/${status.toLowerCase()}`}
          className={cn('filter__link', {
            selected: filterType === status,
          })}
          onClick={() => onChangeFilter(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </a>
      ))}
    </nav>
  );
};
