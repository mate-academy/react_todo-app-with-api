import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  setFilterBy: (arg: Filters) => void;
  filterBy: Filters;
  deleteTodo: () => void
  isActiveTodos: Todo[] | null;
  isCompletedTodos: boolean,
};

export const Filter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  deleteTodo,
  isActiveTodos,
  isCompletedTodos,
}) => {
  const handleChangeFilterBy = (filteredBy: Filters) => {
    setFilterBy(filteredBy);
  };

  const filterByParam = (param: string) => {
    return filterBy === param;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${isActiveTodos?.length} items left`}

      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterByParam('all') })}
          onClick={() => handleChangeFilterBy(Filters.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterByParam('active') })}
          onClick={() => handleChangeFilterBy(Filters.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterByParam('completed') })}
          onClick={() => handleChangeFilterBy(Filters.Completed)}
        >
          Completed
        </a>
      </nav>
      {isCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteTodo}
        >
          Clear completed
        </button>

      )}
    </footer>
  );
};
