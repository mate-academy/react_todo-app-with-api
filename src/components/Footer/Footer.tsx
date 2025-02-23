import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import cn from 'classnames';
import { useTodos } from '../../TodosContext';

export const Footer: React.FC = () => {
  const { todos, filterStatus, handleDeleteTodo, handleChangeFilterStatus } =
    useTodos();

  const leftTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.some(todo => todo.completed);

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => handleDeleteTodo(todo.id));
  }

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {leftTodos} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(FilterStatus).map(filters => (
              <a
                key={filters}
                href="#/"
                className={cn('filter__link', {
                  selected: filterStatus === filters,
                })}
                data-cy={`FilterLink${filters}`}
                onClick={() => handleChangeFilterStatus(filters)}
              >
                {filters}
              </a>
            ))}
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleDeleteAllCompleted}
            disabled={!completedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
