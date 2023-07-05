import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todos: Todo[];
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {todos.filter(todo => !todo.completed).length}
      {' '}
      items left
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.all })}
        onClick={() => setFilterBy(FilterBy.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.active })}
        onClick={() => setFilterBy(FilterBy.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.completed })}
        onClick={() => setFilterBy(FilterBy.completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={() => handleClearCompleted()}
    >
      Clear completed
    </button>
  </footer>
);
