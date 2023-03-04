import React from 'react';
import classNames from 'classnames';

type Props = {
  noCompleteTodos: boolean,
  filterBy: string,
  setFilterBy: (value: string) => void,
  clearCompleted: () => void,
  leftTodos: number,
};

const navigation = ['All', 'Active', 'Completed'];

export const Footer: React.FC<Props> = React.memo(
  ({
    noCompleteTodos,
    filterBy,
    setFilterBy,
    clearCompleted,
    leftTodos,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${leftTodos} items left`}
        </span>

        <nav className="filter">

          {navigation.map((nav) => (
            <a
              key={nav}
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filterBy === nav },
              )}
              onClick={() => setFilterBy(nav)}
            >
              {nav}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={classNames(
            'todoapp__clear-completed',
            { 'todoapp__clear-completed_none': !noCompleteTodos },

          )}
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },

);
