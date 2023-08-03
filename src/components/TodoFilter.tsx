import React from 'react';
import cn from 'classnames';
import { Status } from '../types/Status';

type Props = {
  status: Status,
  onStatusChange: (filter: Status) => void,
};

export const TodoFilter: React.FC<Props> = ({ status, onStatusChange }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: status === Status.ALL,
        })}
        onClick={() => onStatusChange(Status.ALL)}
      >
        {Status.ALL}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: status === Status.ACTIVE,
        })}
        onClick={() => onStatusChange(Status.ACTIVE)}
      >
        {Status.ACTIVE}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: status === Status.COMPLETED,
        })}
        onClick={() => onStatusChange(Status.COMPLETED)}
      >
        {Status.COMPLETED}
      </a>
    </nav>
  );
};
