import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosFilter } from '../types/TodosFilter';
import { TodoContext } from '../Context/TodoContext';

const setFilterDataCyAndHref = (filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return {
        href: '#/active',
        dataCy: 'FilterLinkActive',
      };

    case TodosFilter.Completed:
      return {
        href: '#/completed',
        dataCy: 'FilterLinkCompleted',
      };

    case TodosFilter.All:
    default:
      return {
        href: '#/',
        dataCy: 'FilterLinkAll',
      };
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
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodosFilter).map((value) => {
          const filterData = setFilterDataCyAndHref(value);

          return (
            <a
              href={filterData.href}
              className={cn('filter__link', { selected: value === filter })}
              data-cy={filterData.dataCy}
              key={value}
              onClick={() => {
                onFilterChange(value as TodosFilter);
              }}
            >
              {value}
            </a>
          );
        })}
      </nav>

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
