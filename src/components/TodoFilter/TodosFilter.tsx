import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { Sort } from '../../types/Sort';

type Props = {
  todos: Todo[],
  selectedFilter: Sort,
  setSelectedFilter: Dispatch<SetStateAction<Sort>>,
  clearCompleted: () => void,
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  clearCompleted,
}) => {
  const unComletedTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.filter(todo => todo.completed).length;

  const handleSetSelectedFilter = (sortType: Sort) => () => {
    setSelectedFilter(sortType);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unComletedTodo} ${unComletedTodo === 1 ? 'item' : 'items'} `}
        left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.All,
          })}
          data-cy="FilterLinkAll"
          onClick={handleSetSelectedFilter(Sort.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleSetSelectedFilter(Sort.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleSetSelectedFilter(Sort.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className={classNames(
          'todoapp__clear-completed',
          {
            hidden: !hasCompletedTodo,
          },
        )}
        onClick={clearCompleted}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
