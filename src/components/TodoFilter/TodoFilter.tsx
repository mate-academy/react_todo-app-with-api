import React from 'react';
import classNames from 'classnames';
import { countTodos } from '../../utils/countTodos';
import { Filters } from '../../utils/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterParam: string,
  onFilterChange: (newFilter: Filters) => void,
  clearCompleted: () => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterParam,
  onFilterChange,
  clearCompleted,
}) => {
  const uncompletedTodosCount = countTodos(todos, false).length;
  const itemsLeft = `${uncompletedTodosCount} item${uncompletedTodosCount === 1 ? '' : 's'} left`;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {itemsLeft}
      </span>

      <nav className="filter">
        {(Object.values(Filters))
          .map((value) => {
            const hrefValue = value === 'all'
              ? '#/'
              : `#/${value.toLowerCase()}`;

            return (
              <a
                href={hrefValue}
                className={classNames(
                  'filter__link',
                  'is-capitalized',
                  { selected: filterParam === value },
                )}
                key={value}
                onClick={() => onFilterChange(value)}
              >
                {value}
              </a>
            );
          })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={countTodos(todos, true).length === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
