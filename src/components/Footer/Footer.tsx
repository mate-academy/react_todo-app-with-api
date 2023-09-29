import React from 'react';
import classNames from 'classnames';
import { TodosSortType } from '../../types/TodosSortType';

type Props = {
  todosSortBy: TodosSortType,
  onSortByField: (sortBy: TodosSortType) => void,
  completedTodosLength: number,
  clearAllCompleted: () => void,
  todosLength: number,
};

export const Footer: React.FC<Props> = ({
  onSortByField,
  todosSortBy,
  completedTodosLength,
  clearAllCompleted,
  todosLength,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosSortBy === TodosSortType.All
          ? `${todosLength - completedTodosLength} items left`
          : `${todosLength} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: todosSortBy === TodosSortType.All,
            },
          )}
          data-cy="FilterLinkAll"
          onClick={() => onSortByField(TodosSortType.All)}
        >
          {TodosSortType.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: todosSortBy === TodosSortType.Active,
            },
          )}
          data-cy="FilterLinkActive"
          onClick={() => onSortByField(TodosSortType.Active)}
        >
          {TodosSortType.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: todosSortBy === TodosSortType.Completed,
            },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => onSortByField(TodosSortType.Completed)}
        >
          {TodosSortType.Completed}
        </a>
      </nav>

      <button
        type="button"
        aria-label="ClearCompletedButton"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosLength}
        onClick={clearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
