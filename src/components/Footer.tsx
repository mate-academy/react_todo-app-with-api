import React from 'react';
import cn from 'classnames';
import { countActiveTodos, countCompletedTodos } from '../utils/helpers';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todos: Todo[],
  filterBy: FilterBy,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
  handleDeleteCompletedTodos: () => Promise<void>,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  handleDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos(todos)} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': countCompletedTodos(todos) === 0,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodos}
        disabled={countCompletedTodos(todos) === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
