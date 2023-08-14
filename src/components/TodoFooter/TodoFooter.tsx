import React from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

interface Props{
  filterOption: FilterOptions;
  setFilterOption: (option: FilterOptions) => void;
  activeVisibleTodosLength: number;
  completedVisibleTodos: Todo[];
  deleteTodos: (todoIds: Todo[]) => void;
}

export const TodoFooter: React.FC<Props> = ({
  filterOption,
  setFilterOption,
  activeVisibleTodosLength,
  completedVisibleTodos,
  deleteTodos,
}) => {
  const isCompletedTodosPresent = completedVisibleTodos.length > 0;
  const handleRemoveCompletedTodos = () => deleteTodos(completedVisibleTodos);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeVisibleTodosLength} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterOptions).map((filter) => {
          const isSelected = filterOption === filter;

          return (
            <a
              href={`#/${filter}`}
              key={filter}
              className={cn(
                'filter__link',
                { selected: isSelected },
              )}
              onClick={() => setFilterOption(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: isCompletedTodosPresent
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
