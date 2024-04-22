import classNames from 'classnames';
import React from 'react';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  activeTodosCount: number;
  onClearCompleted: () => void;
  hasCompletedTodo: boolean;
  selectedFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  onClearCompleted,
  hasCompletedTodo,
  selectedFilter,
  onFilterChange,
}) => {
  const renderFilterLink = (filter: TodoFilter) => (
    <a
      href={`#/${filter}`.toLowerCase()}
      className={classNames('filter__link', {
        selected: selectedFilter === filter,
      })}
      data-cy={`FilterLink${filter}`}
      onClick={() => onFilterChange(filter)}
    >
      {filter}
    </a>
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {renderFilterLink(TodoFilter.All)}
        {renderFilterLink(TodoFilter.Active)}
        {renderFilterLink(TodoFilter.Completed)}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
