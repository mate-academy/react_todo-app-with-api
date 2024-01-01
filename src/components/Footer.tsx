import React, { useContext } from 'react';
import cn from 'classnames';

import { FilterBy } from '../types/Filter';
import { AppContext } from '../AppContext';

export const Footer: React.FC = React.memo(() => {
  const {
    todos,
    filterBy,
    setFilterBy,
    clearCompleted,
  } = useContext(AppContext);

  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const isSomeTodosCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.All },
          )}
          onClick={() => setFilterBy(FilterBy.All)}
        >
          {FilterBy.All}
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.Active },
          )}
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          {FilterBy.Active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={cn(
            'filter__link',
            { selected: filterBy === FilterBy.Completed },
          )}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          {FilterBy.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          disabled: !isSomeTodosCompleted,
        })}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
