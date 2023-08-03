// #region IMPORTS
import React, { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { TodosContext } from './TodoContext';
// #endregion

type Props = {
  completedCount: number;
  activeCount: number;
  filter: string,
  onFilterChange: (value: Filter) => void;
};

export const TodoFooter: React.FC<Props> = ({
  completedCount,
  activeCount,
  filter,
  onFilterChange,
}) => {
  const todosContext = useContext(TodosContext);

  if (!todosContext) {
    return null;
  }

  const { deleteCompletedTodos } = todosContext;

  function handleFilterChange(innerFilter: Filter) {
    onFilterChange(innerFilter);
  }

  function handleDeleteAllCompleted() {
    deleteCompletedTodos();
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link', { selected: filter === Filter.All },
          )}
          onClick={() => handleFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: filter === Filter.Active },
          )}
          onClick={() => handleFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: filter === Filter.Completed },
          )}
          onClick={() => handleFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleDeleteAllCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>

    </footer>
  );
};
