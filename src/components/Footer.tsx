import React from 'react';
import classNames from 'classnames';
import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

type Props = {
  filter: Filters;
  onFilter: (filter: Filters) => void;
  todos: Todo[];
  onDeleteAllComleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  todos,
  onDeleteAllComleted,
}) => {
  const filterOptions = [Filters.All, Filters.Active, Filters.Completed];
  const isNotDisabled = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(filterOption => (
          <a
            key={filterOption}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={() => onFilter(filterOption)}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isNotDisabled}
        onClick={onDeleteAllComleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
