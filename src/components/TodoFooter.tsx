import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/enum';

interface TodoFooterProps {
  todos: Todo[];
  filterMethod: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => Promise<void>;
  items: number;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  filterMethod,
  onFilterChange,
  onClearCompleted,
  items,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${items} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterMethod === Filter.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filter.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterMethod === Filter.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filter.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: filterMethod === Filter.completed,
        })}
        onClick={() => onFilterChange(Filter.completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={onClearCompleted}
      disabled={todos.every(todo => !todo.completed)}
    >
      Clear completed
    </button>
  </footer>
);
