import classNames from 'classnames';

import { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

import { Status } from '../../types/Status';

export const FilterTodos = () => {
  const { filterTodos, setFilterTodos } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterTodos === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterTodos(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterTodos === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterTodos(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterTodos === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterTodos(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
