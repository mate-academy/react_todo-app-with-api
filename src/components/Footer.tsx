import React, { useContext } from 'react';
import { Status } from '../services/Status';
// eslint-disable-next-line import/no-cycle
import { TodosContext } from './TodosContext';

export const Footer: React.FC = () => {
  const {
    todos,
    clearForm,
    setFilter,
    filter,
  } = useContext(TodosContext);

  const count = todos.filter(todo => !todo.completed).length;

  const hasCompleted = todos.some(todo => todo.completed);

  const handleFilterClick = (newFilter: Status) => {
    setFilter(newFilter);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${count} ${
              count === 1 ? 'item' : 'items'
            } left`}

          </span>

          <nav className="filter">
            <a
              href="#/"
              className={`filter__link ${
                filter === Status.ALL ? 'selected' : ''
              }`}
              onClick={() => handleFilterClick(Status.ALL)}
            >
              All9
            </a>

            <a
              href="#/active"
              className={`filter__link ${
                filter === Status.ACTIVE ? 'selected' : ''
              }`}
              onClick={() => handleFilterClick(Status.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${
                filter === Status.COMPLETED ? 'selected' : ''
              }`}
              onClick={() => handleFilterClick(Status.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          {hasCompleted && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearForm}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
