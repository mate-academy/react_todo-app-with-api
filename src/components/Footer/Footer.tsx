import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';
// import { footer }

type Props = {
  filterBy: FilterBy,
  setFilterBy: (filter: FilterBy) => void,
  countTodos: number,
  isCompleted: boolean,
  removeAllComplited: () => void,
};

export const Footer:React.FC<Props> = React.memo(
  ({
    filterBy,
    setFilterBy,
    countTodos,
    isCompleted,
    removeAllComplited,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === FilterBy.all },
          )}
          onClick={() => (setFilterBy(FilterBy.all))}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === FilterBy.active },
          )}
          onClick={() => (setFilterBy(FilterBy.active))}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === FilterBy.completed },
          )}
          onClick={() => (setFilterBy(FilterBy.completed))}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={classNames(
          {
            todoapp__clear: !isCompleted,
            'todoapp__clear-completed': isCompleted,
          },
        )}
        onClick={removeAllComplited}
      >
        Clear completed
      </button>
    </footer>
  ),
);
