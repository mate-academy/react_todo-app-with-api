import React from 'react';
import cn from 'classnames';
import './Footer.scss';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  selectedFilter: Filter;
  onFilterAll: () => void;
  onFilterActive: () => void;
  onFilterCompleted: () => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  onFilterAll,
  onFilterActive,
  onFilterCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={onFilterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={onFilterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={onFilterCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="footer__clear-completed"
        data-cy="ClearCompletedButton"
        // if all todos not completed the button isn't shown
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
