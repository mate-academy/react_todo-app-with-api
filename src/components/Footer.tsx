import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { SORTFIELD } from '../types/SortField';

type Props = {
  todos: Todo[];
  sortField: SORTFIELD;
  deleteAllCompleted: () => void;
  setSortField: (value: SORTFIELD) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  sortField,
  deleteAllCompleted,
  setSortField,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: sortField === SORTFIELD.ALL,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setSortField(SORTFIELD.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: sortField === SORTFIELD.ACTIVE,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setSortField(SORTFIELD.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: sortField === SORTFIELD.COMPLETED,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setSortField(SORTFIELD.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteAllCompleted}
          disabled={completedTodos.length === 0}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
