import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterTodos: (type: Filter) => void;
  countOfActiveTodos: number;
  completedTodoLength: number;
  removeAllCompletedTodos: () => void;
  selectedFilter: Filter;
  changeSelectedFilter: (select: Filter) => void;

};

export const Footer: React.FC<Props> = React.memo(({
  filterTodos,
  countOfActiveTodos,
  completedTodoLength,
  removeAllCompletedTodos,
  selectedFilter,
  changeSelectedFilter,

}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${countOfActiveTodos} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          // eslint-disable-next-line
          { 'selected': selectedFilter === Filter.All },
        )}
        onClick={() => {
          filterTodos(Filter.All);
          changeSelectedFilter(Filter.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          // eslint-disable-next-line
          { 'selected': selectedFilter === Filter.Active },
        )}
        onClick={() => {
          filterTodos(Filter.Active);
          changeSelectedFilter(Filter.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          // eslint-disable-next-line
          { 'selected': selectedFilter === Filter.Completed },
        )}
        onClick={() => {
          filterTodos(Filter.Completed);
          changeSelectedFilter(Filter.Completed);
        }}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className={cn('todoapp__clear-completed', {
        'todoapp__clear-completed--novisible': !completedTodoLength,
      })}
      onClick={removeAllCompletedTodos}
      disabled={!completedTodoLength}
    >
      Clear completed
    </button>
  </footer>
));
