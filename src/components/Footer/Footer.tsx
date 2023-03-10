import React from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-cycle
import { SortType } from '../../App';

type Props = {
  hasCompleteTodos: boolean,
  filterBy: SortType,
  setFilterBy: (value: SortType) => void,
  clearCompleted: () => void,
  leftTodos: number,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    hasCompleteTodos,
    filterBy,
    setFilterBy,
    clearCompleted,
    leftTodos,
  }) => (

    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.ALL },
          )}
          onClick={() => setFilterBy(SortType.ALL)}
        >
          {SortType.ALL}
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.ACTIVE },
          )}
          onClick={() => setFilterBy(SortType.ACTIVE)}
        >
          {SortType.ACTIVE}
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.COMPLETED },
          )}
          onClick={() => setFilterBy(SortType.COMPLETED)}
        >
          {SortType.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed_none': !hasCompleteTodos },

        )}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  ),
);
