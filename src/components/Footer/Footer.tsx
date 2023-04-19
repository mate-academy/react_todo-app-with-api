import React from 'react';
import { setSingleOrPluralWordByCount } from '../../HelpersFunctions';
import { TodoFilter } from '../TodoFilter';
import { FilterBy } from '../../types/FilteredBy';

type Props = {
  countActiveTodos: number;
  hasCompletedTodo: boolean;
  handleRemoveAllCompletedTodo: () => void;
  setFilterType: (type: FilterBy) => void;
  filterType: FilterBy;
};

export const Footer: React.FC<Props> = ({
  countActiveTodos,
  hasCompletedTodo,
  handleRemoveAllCompletedTodo,
  setFilterType,
  filterType,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${countActiveTodos} ${setSingleOrPluralWordByCount('item', countActiveTodos)} left`}
    </span>

    <nav className="filter">
      <TodoFilter
        filteredTodos={filterType}
        setFilteredTodos={setFilterType}
      />
    </nav>

    {hasCompletedTodo
    && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveAllCompletedTodo}
      >
        Clear completed
      </button>
    )}

  </footer>
);
