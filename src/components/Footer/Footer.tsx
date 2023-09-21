import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/Todo';

type Props = {
  filterBy: TodoStatus,
  setFilterBy: (filterBy: TodoStatus) => void;
  activeTodosQuantity: number;
  completedTodosQuantity: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeTodosQuantity,
  completedTodosQuantity,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosQuantity} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterBy === TodoStatus.ALL,
        })}
        onClick={() => setFilterBy(TodoStatus.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterBy === TodoStatus.ACTIVE,
        })}
        onClick={() => setFilterBy(TodoStatus.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterBy === TodoStatus.COMPLETED,
        })}
        onClick={() => setFilterBy(TodoStatus.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    {/* don't show this button if there are no completed todos */}
    {completedTodosQuantity ? (
      <button
        type="button"
        className="todoapp__clear-completed"
        hidden={!(completedTodosQuantity > 0)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    ) : ('')}
  </footer>
);
