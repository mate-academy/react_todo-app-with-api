import { useContext } from 'react';
import classNames from 'classnames';

import { Status } from '../types/Status';

import { TodoContext } from './TodosContext';
import { TodoContextProps } from '../types/TodoContextProps';

interface PropsFilter {
  filter: Status;
  setFilter: (filter: Status) => void;
}

export const TodosFilter: React.FC<PropsFilter> = () => {
  const todoContext = useContext<TodoContextProps>(TodoContext);

  const filter = todoContext?.filter;
  const setFilter = todoContext?.setFilter;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Status.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Status.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Status.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
