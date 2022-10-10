import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterBy: Filter,
  setFilterBy: Dispatch<SetStateAction<Filter>>
  isCompletedTodos: boolean,
  activeTodos: number,
  onDelete: () => void,
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  isCompletedTodos,
  activeTodos,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.All },
          )}
          onClick={() => setFilterBy(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.Active },
          )}
          onClick={() => setFilterBy(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === Filter.Completed },
          )}
          onClick={() => setFilterBy(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onDelete}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
