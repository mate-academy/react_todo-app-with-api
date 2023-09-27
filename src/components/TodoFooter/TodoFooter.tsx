import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { useTodos } from '../../TodosContext';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    filter,
    handleFilter,
    handleClearComplete,
  } = useTodos();

  const numberOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return todos.length
    ? (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${numberOfActiveTodos} ${numberOfActiveTodos === 1 ? 'item' : 'items'} left`}
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.keys(Filter).map((key) => {
            const value = Filter[key as keyof typeof Filter];

            return (
              <a
                key={key}
                data-cy={`FilterLink${key}`}
                href={`#/${value}`}
                className={classNames('filter__link', {
                  selected: value === filter,
                })}
                onClick={() => handleFilter(value)}
              >
                {key}
              </a>
            );
          })}
        </nav>

        {hasCompletedTodos
          && (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearComplete}
            >
              Clear completed
            </button>
          )}
      </footer>
    ) : null;
};
