import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todosLeft: number;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
  handleClearCompleted: () => void;
  isTodosCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  todosLeft,
  filterBy,
  setFilterBy,
  handleClearCompleted,
  isTodosCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${todosLeft} items left`}
    </span>

    <nav className="filter">
      {Object.entries(FilterBy).map(([, value]) => (
        <a
          href={`#/${value.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: filterBy === value,
          })}
          onClick={() => setFilterBy(value)}
        >
          {value}
        </a>
      ))}
    </nav>

    {isTodosCompleted
      && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
  </footer>
);
