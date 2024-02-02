import React, { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { TodoContext } from '../../context/TodoContext';

export const TodoFilter: React.FC = () => {
  const { filter, handleFilter } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link',
          { selected: filter === Status.All })}
        data-cy="FilterLinkAll"
        onClick={() => handleFilter(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: filter === Status.Active })}
        data-cy="FilterLinkActive"
        onClick={() => handleFilter(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: filter === Status.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleFilter(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
