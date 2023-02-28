import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/filter';

type Props = {
  filter: Filter,
  filterTodosBy: (filter: Filter) => void,
  activeTodosAmount: number,
  isThereCompleted: boolean
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filter,
    filterTodosBy,
    activeTodosAmount,
    isThereCompleted,
    removeCompletedTodos,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter">
        {Object.values(Filter).map(element => (
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filter === element,
            })}
            onClick={() => filterTodosBy(element)}
          >
            {element}
          </a>
        ))}
      </nav>

      {isThereCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompletedTodos}
        >
          Clear completed
        </button>
      )}

    </footer>
  ),
);
