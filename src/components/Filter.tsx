import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/filterType';

interface FilterProps {
  handleFilterChange: (value: FilterType) => void,
  filter: FilterType,
  handleRemoveCompleted: () => void,
  todos: Todo[],
}

export const Filter: React.FC<FilterProps> = ({
  handleFilterChange,
  filter,
  handleRemoveCompleted,
  todos,
}) => {
  const [completed, setCompleted] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(todos.filter(todo => !todo.completed).length);
    setCompleted(todos.filter(todo => todo.completed).length);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${active} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterType.All && 'selected'}`}
          onClick={() => handleFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === FilterType.Active && 'selected'}`}
          onClick={() => handleFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === FilterType.Completed && 'selected'}`}
          onClick={() => handleFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompleted}
      >
        {completed > 0 && ('Clear completed')}
      </button>
    </footer>
  );
};
