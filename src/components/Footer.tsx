import React from 'react';
import classNames from 'classnames';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  someCompleted: boolean,
  activeTodos: Todo[],
  filter: Filter,
  onChange: (selector: Filter) => void,
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  someCompleted,
  activeTodos,
  filter,
  onChange,
  onClearCompleted,
}) => {
  const handleAllClick = () => {
    onChange(Filter.All);
  };

  const handleActiveClick = () => {
    onChange(Filter.Active);
  };

  const handleCompletedClick = () => {
    onChange(Filter.Completed);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          onClick={handleAllClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Active },
          )}
          onClick={handleActiveClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Completed },
          )}
          onClick={handleCompletedClick}
        >
          Completed
        </a>
      </nav>

      {someCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
