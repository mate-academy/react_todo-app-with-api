import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Filter } from '../types/types';

interface Props {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  deleteCompleted: (ids: number[]) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  deleteCompleted,
}) => {
  const clearCompleted = todos
    ?.filter(el => {
      if (el.completed) {
        return true;
      }

      return false;
    })
    .map((el: Todo) => el.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${cn({ selected: filter === 'All' })}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${cn({ selected: filter === 'Active' })}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${cn({ selected: filter === Filter.Completed })}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteCompleted(clearCompleted)}
        disabled={todos.every((el: Todo) => !el.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
