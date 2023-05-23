import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';
import { FilterItem } from '../FilterItem';

type Props = {
  countActiveTodos: number;
  countCompletedTodos: number;
  selectedFilter: TodoStatus;
  onFilterSelect: (newFilter: TodoStatus) => void;
  onClear: () => void;
};

const filterOptions = Object.values(TodoStatus);

export const Filter: React.FC<Props> = React.memo(
  ({
    countActiveTodos,
    countCompletedTodos,
    selectedFilter,
    onFilterSelect,
    onClear,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">{`${countActiveTodos} items left`}</span>

        <nav className="filter">
          {filterOptions.map((option) => (
            <FilterItem
              key={option}
              option={option}
              onFilterSelect={onFilterSelect}
              selectedFilter={selectedFilter}
            />
          ))}
        </nav>

        {countCompletedTodos > 0 && (
          <button
            type="button"
            className={cn('todoapp__clear-completed', {
              hidden: countCompletedTodos === 0,
            })}
            onClick={onClear}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  },
);
