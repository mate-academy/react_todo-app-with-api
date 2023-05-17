import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  countActiveTodos: number;
  countCompletedTodos: number;
  selectedFilter: TodoStatus;
  onFilterSelect: (newFilter: TodoStatus) => void;
  handleClearCompleted: () => void;
};

const filterOptions = Object.values(TodoStatus);

export const Filter: React.FC<Props> = React.memo(
  ({
    countActiveTodos,
    countCompletedTodos,
    selectedFilter,
    onFilterSelect,
    handleClearCompleted,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">{`${countActiveTodos} items left`}</span>

        <nav className="filter">
          {filterOptions.map((option) => (
            <a
              key={option}
              href={`#/${option}`}
              className={cn('filter__link', {
                selected: option === selectedFilter,
              })}
              onClick={() => onFilterSelect(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </a>
          ))}
        </nav>

        {countCompletedTodos > 0 && (
          <button
            type="button"
            className={cn('todoapp__clear-completed', {
              hidden: countCompletedTodos === 0,
            })}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  },
);
