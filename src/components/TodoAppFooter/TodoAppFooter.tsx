import React from 'react';
import cn from 'classnames';
import { FilterLink } from '../../types/FilterLinkTypes';

type Props = {
  setSelectedFilter: (value: FilterLink) => void;
  selectedFilter: FilterLink;
  todosCounter: number;
  hasCompletedTodo: boolean;
  deleteAllComleted: () => void;
};

export const TodoAppFooter: React.FC<Props> = ({
  selectedFilter,
  setSelectedFilter,
  hasCompletedTodo,
  todosCounter,
  deleteAllComleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todosCounter === 1 && (
        'One item left'
      )}

      {todosCounter > 1 && (
        `${todosCounter} items left`
      )}

      {!todosCounter && (
        'No active todos'
      )}
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterLink).map(([key, value]) => (
        <a
          key={key}
          href={`#/${value}`}
          className={cn('filter__link', {
            selected: value === selectedFilter,
          })}
          data-cy={`FilterLink${key}`}
          onClick={() => setSelectedFilter(value)}
        >
          {key}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className={cn('todoapp__clear-completed', {
        'is-invisible': !hasCompletedTodo,
      })}
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodo}
      onClick={deleteAllComleted}
    >
      Clear completed
    </button>
  </footer>
);
