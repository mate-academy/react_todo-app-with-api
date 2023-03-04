import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  setFilterBy: (filterType: FilterType) => void,
  filterBy: FilterType,
  removeAllCompletedTodos: () => void,
  numberOfNotCompletedTodos: number,
  isClearAllButtonVisible: boolean,
};

export const Footer: React.FC<Props> = React.memo(({
  setFilterBy,
  filterBy,
  removeAllCompletedTodos,
  numberOfNotCompletedTodos,
  isClearAllButtonVisible,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${numberOfNotCompletedTodos} items left`}
    </span>

    <nav className="filter">
      {Object.values(FilterType).map((type) => (
        <a
          key={type}
          href={`#/${type}`}
          className={cn('filter__link', {
            selected: filterBy === type,
          })}
          onClick={() => setFilterBy(type)}
        >
          {type}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={removeAllCompletedTodos}
      disabled={isClearAllButtonVisible}
    >
      Clear completed
    </button>
  </footer>
));
