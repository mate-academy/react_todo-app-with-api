import React from 'react';
import cn from 'classnames';
import { SortType } from '../../types/SortType';

interface Props {
  activeTodosAmount: number;
  onSort: (sortType: SortType) => void;
  sortType: SortType;
  onClearCompletedTodos: () => void;
  isCompletedTodo: boolean;
}
export const Footer: React.FC<Props> = ({
  activeTodosAmount,
  onSort,
  sortType,
  onClearCompletedTodos,
  isCompletedTodo,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosAmount} items left`}
    </span>

    <nav className="filter">
      {Object.values(SortType).map(filterType => (
        <a
          href="#/"
          className={cn('filter__link', {
            selected: sortType === filterType,
          })}
          onClick={() => onSort(filterType)}
        >
          {filterType}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className={cn(
        'todoapp__clear-completed',
        { 'todoapp__clear-completed-hidden': !isCompletedTodo },
      )}
      onClick={onClearCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
