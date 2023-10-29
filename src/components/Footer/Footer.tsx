import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { StateContext } from '../TodosContext/TodosContext';

type Props = {
  setFilter: (filter: string) => void,
  handleClearAll: () => void,
};

export const Footer: React.FC<Props> = ({ setFilter, handleClearAll }) => {
  const state = useContext(StateContext);

  const { todos } = state;

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTodos, setActiveTodos] = useState(0);

  useEffect(() => {
    setActiveTodos(todos.filter((todo => !todo.completed)).length);
  }, [todos]);

  const handleSetFilter = (filter: string) => {
    switch (filter) {
      case 'active':
        setActiveFilter('active');
        setFilter('active');
        break;

      case 'completed':
        setActiveFilter('completed');
        setFilter('completed');
        break;

      default:
        setActiveFilter('all');
        setFilter('all');
        break;
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleSetFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleSetFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleSetFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={activeTodos === todos.length}
        onClick={handleClearAll}
      >
        Clear completed
      </button>

    </footer>
  );
};
