import React, { useState } from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type FilterProps = {
  handleFilter: (newFilter: Filter) => void;
  todos: Todo[];
  handleClearCompleted: () => void;
};

export const FooterFilter: React.FC<FilterProps>
  = ({ handleFilter, todos, handleClearCompleted }) => {
    const [selectedFilter, setSelectedFilter] = useState<Filter>('all');

    const handleFilterClick = (filter: Filter) => {
      setSelectedFilter(filter);
      handleFilter(filter);
    };

    const todosLeft = todos.filter((todo) => !todo.completed).length;

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${todosLeft} items left`}
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={`filter__link ${selectedFilter === 'all' ? 'selected' : ''}`}
            data-cy="FilterLinkAll"
            onClick={() => handleFilterClick('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={`filter__link ${selectedFilter === 'active' ? 'selected' : ''}`}
            data-cy="FilterLinkActive"
            onClick={() => handleFilterClick('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={`filter__link ${selectedFilter === 'completed' ? 'selected' : ''}`}
            data-cy="FilterLinkCompleted"
            onClick={() => handleFilterClick('completed')}
          >
            Completed
          </a>
        </nav>

        {/* don't show this button if there are no completed todos */}
        {todos.filter(todo => todo.completed).length !== 0
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  };
