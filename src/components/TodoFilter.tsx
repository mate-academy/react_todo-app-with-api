import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosFilter } from '../types/TodosFilter';
import { TodoContext } from '../Context/TodoContext';

const setFilterHref = (filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return '#/active';

    case TodosFilter.Completed:
      return '#/completed';

    case TodosFilter.All:
    default:
      return '#/';
  }
};

const setFilterDataCy = (filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return 'FilterLinkActive';

    case TodosFilter.Completed:
      return 'FilterLinkCompleted';

    case TodosFilter.All:
    default:
      return 'FilterLinkAll';
  }
};

type Props = {
  filter: TodosFilter;
  onFilterChange: (filter: TodosFilter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  onFilterChange,
}) => {
  const {
    completedTodos,
    uncompletedTodos,

    handleClearCompletedTodos,
  } = useContext(TodoContext);
  const uncompletedTodosAmount = uncompletedTodos.length;
  const hasCompletedTodos = !!completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosAmount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodosFilter).map((value) => (
          <a
            href={setFilterHref(value)}
            className={cn('filter__link', { selected: value === filter })}
            data-cy={setFilterDataCy(value)}
            key={value}
            onClick={() => {
              onFilterChange(value as TodosFilter);
            }}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          { hidden: !hasCompletedTodos },
        )}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
