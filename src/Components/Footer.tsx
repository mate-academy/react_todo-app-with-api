import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filters } from '../types/enums';

interface FooterPropsType {
  selectedStatus: string,
  setSelectedStatus: (selectedStatus: Filters) => void,
  todos: Todo[],
  clearAllCompleted: () => void,
}

export const Footer: React.FC<FooterPropsType> = ({
  selectedStatus,
  setSelectedStatus,
  todos,
  clearAllCompleted,
}) => {
  const todoLeft = todos.filter(todo => !todo.completed).length;
  const todoCompleted = todos.filter(todo => todo.completed).length;
  const { all, active, completed } = Filters;
  const isEnableClearButton = todoCompleted > 0;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === all },
          )}
          onClick={() => setSelectedStatus(all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === active },
          )}
          onClick={() => setSelectedStatus(active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === completed },
          )}
          onClick={() => setSelectedStatus(completed)}
        >
          Completed
        </a>
      </nav>
      <div style={{ width: '98px' }}>
        {isEnableClearButton && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => clearAllCompleted()}
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};
