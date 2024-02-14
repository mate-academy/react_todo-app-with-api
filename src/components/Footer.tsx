import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  filteredTodosList: Todo[],
  activeFilter: string,
  tempTodo: Todo[],
  handleClearCompleted: () => void,
  handleFilterChange: (filter: Status) => void,
};

export const Footer: React.FC<Props> = ({
  filteredTodosList,
  activeFilter,
  tempTodo,
  handleClearCompleted,
  handleFilterChange,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${filteredTodosList.length} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: activeFilter === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleFilterChange(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: activeFilter === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleFilterChange(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: activeFilter === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleFilterChange(Status.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleClearCompleted}
    >
      {tempTodo.filter(todo => todo.completed).length > 0 && (
        <span>Clear completed</span>
      )}
    </button>

  </footer>
);
