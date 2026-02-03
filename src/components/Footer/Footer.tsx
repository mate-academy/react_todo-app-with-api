import React from 'react';
import { Filter } from '../../App';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface PropsFooter {
  todos: Todo[];
  filter: Filter;
  onFilter: (value: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<PropsFooter> = ({
  todos,
  filter,
  onFilter,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {todos.length > 0 && (
        <>
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCount} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', { selected: filter === 'all' })}
              data-cy="FilterLinkAll"
              onClick={() => onFilter('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', { selected: filter === 'active' })}
              data-cy="FilterLinkActive"
              onClick={() => onFilter('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filter === 'completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => onFilter('completed')}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={onClearCompleted}
            disabled={!hasCompleted}
          >
            Clear completed
          </button>
        </>
      )}
    </footer>
  );
};
