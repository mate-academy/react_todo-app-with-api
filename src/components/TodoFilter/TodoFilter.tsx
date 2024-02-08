import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { Status } from '../../types/Status';

export const TodoFilter: React.FC = () => {
  const { filterField, handleFilterField } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: filterField === Status.All })}
        data-cy="FilterLinkAll"
        onClick={() => handleFilterField(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: filterField === Status.Active })}
        data-cy="FilterLinkActive"
        onClick={() => handleFilterField(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: filterField === Status.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleFilterField(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
