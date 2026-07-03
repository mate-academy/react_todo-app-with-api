import React from 'react';
import { TodoStatus, TodoStatusMap } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  status: TodoStatus;
  onChange: (status: TodoStatus) => void;
};

const filters = [
  {
    href: '#/',
    name: TodoStatusMap.All,
    cy: 'FilterLinkAll',
    text: 'All',
  },
  {
    href: '#/active',
    name: TodoStatusMap.Active,
    cy: 'FilterLinkActive',
    text: 'Active',
  },
  {
    href: '#/completed',
    name: TodoStatusMap.Completed,
    cy: 'FilterLinkCompleted',
    text: 'Completed',
  },
];

export const TodoFilter: React.FC<Props> = ({ status, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filter => (
        <a
          key={filter.href}
          href={filter.href}
          className={cn('filter__link', {
            selected: status === filter.name,
          })}
          data-cy={filter.cy}
          onClick={() => onChange(filter.name)}
        >
          {filter.text}
        </a>
      ))}
    </nav>
  );
};
