import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/todos';

export enum TodoFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  todos: Todo[];
  activeItems: Todo[];
  status: TodoFilter;
  onChangeStatus: (s: TodoFilter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  activeItems,
  status,
  onChangeStatus,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeItems.length} items left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === TodoFilter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onChangeStatus(TodoFilter.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === TodoFilter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onChangeStatus(TodoFilter.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === TodoFilter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onChangeStatus(TodoFilter.Completed)}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={onClearCompleted}
      disabled={!todos.find(t => t.completed)}
    >
      Clear completed
    </button>
  </footer>
);
