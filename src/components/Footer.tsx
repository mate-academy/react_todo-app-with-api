import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';
import { SORT } from '../types/Sort';

export const Footer: React.FC = () => {
  const {
    todos,
    itemsLeft,
    itemsCompleted,
    currentFilter,
    setCurrentFilter,
    handleDeleteCompletedTodos,
  } = useContext(TodoContext);

  const hasTodos = todos.length > 0;
  const completedItemsCount = itemsCompleted;

  if (!hasTodos && currentFilter === SORT.ALL) {
    return null;
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${itemsLeft} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${
            currentFilter === SORT.ALL ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            currentFilter === SORT.ACTIVE ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            currentFilter === SORT.COMPLETED ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedItemsCount === 0,
        })}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
