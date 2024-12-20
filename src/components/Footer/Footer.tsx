import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../App';

interface Props {
  filter: string;
  nrOfActiveTodos: number;
  todos: Todo[];
  setFilter: (arg: Filter) => void;
  onDeleteSelected: () => void;
}

export const Footer: React.FC<Props> = React.memo(
  ({ filter, nrOfActiveTodos, todos, setFilter, onDeleteSelected }) => {
    const isCompletedExists = todos.some(todo => todo.completed);
    const filterFs: (() => void)[] = [];
    const filterValues = Object.values(Filter);

    filterValues.forEach(
      (value, index) => (filterFs[index] = () => setFilter(value)),
    );

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {nrOfActiveTodos} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {filterValues.map((value, i) => {
            return (
              <a
                key={value + i}
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === value,
                })}
                data-cy={`FilterLink${value}`}
                onClick={filterFs[i]}
              >
                {value}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!isCompletedExists}
          onClick={onDeleteSelected}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
