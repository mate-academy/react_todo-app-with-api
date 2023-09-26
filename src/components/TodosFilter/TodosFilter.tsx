import React, { useContext } from 'react';
import classnames from 'classnames';
import { StatusEnum } from '../../types/StatusEnum';
import { FilterTodosContext } from '../../context/TodosContexts';

type Props = {};

export const TodosFilter: React.FC<Props> = () => {
  const { filter, setFilter } = useContext(FilterTodosContext);

  return (
    <nav className="filters" data-cy="Filter">
      <a
        href="#/"
        className={classnames('filter__link', {
          selected: filter === StatusEnum.All,
        })}
        onClick={() => setFilter(StatusEnum.All)}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        className={classnames('filter__link', {
          selected: filter === StatusEnum.Active,
        })}
        onClick={() => setFilter(StatusEnum.Active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classnames('filter__link', {
          selected: filter === StatusEnum.Completed,
        })}
        onClick={() => setFilter(StatusEnum.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
