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
  const onAllClick = () => {
    onChange(Filter.all);
  };

  const onActiveClick = () => {
    onChange(Filter.active);
  };

  const onCompletedClick = () => {
    onChange(Filter.completed);
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
            { selected: filter === Filter.all },
          )}
          onClick={onAllClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.active },
          )}
          onClick={onActiveClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.completed },
          )}
          onClick={onCompletedClick}
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
