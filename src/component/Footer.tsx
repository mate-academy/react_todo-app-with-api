import * as React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../utils/Filter';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  onClear: () => void;
  setFilter: (filter: Filter) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onClear,
  setFilter,
}) => {
  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.All })}
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.All);
          }}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
