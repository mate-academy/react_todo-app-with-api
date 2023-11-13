import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterParams } from '../../types/FilteredParams';

type Props = {
  todos: Todo[];
  filterValue: FilterParams,
  setFilterValue: (filterValue: FilterParams) => void;
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterValue,
  setFilterValue,
  removeCompletedTodos,
}) => {
  const isSomeCompletedTodo = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterParams).map(value => {
          const normalizeValue = value
            .replace(value[0], value[0].toUpperCase());

          return (
            <a
              key={value}
              href={value === FilterParams.All ? '#/' : `#/${value}`}
              className={cn('filter__link', {
                selected: filterValue === value,
              })}
              data-cy={`FilterLink${normalizeValue}`}
              onClick={() => {
                setFilterValue(value);
              }}
            >
              {normalizeValue}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeCompletedTodo}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
