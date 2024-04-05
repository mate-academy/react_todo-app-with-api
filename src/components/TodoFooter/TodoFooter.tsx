import React, { useMemo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import classNames from 'classnames';
import { useTodosContext } from '../../context/TodoContext';

export const TodoFooter: React.FC = () => {
  const { todos, status, setStatus, onHandleDeleteTodo } = useTodosContext();

  const completedTodos = todos.filter(todo => todo.completed);

  const leftTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const onHandleDeleteCompleted = () => {
    completedTodos.forEach(todo => {
      onHandleDeleteTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${leftTodos} item${leftTodos > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(filterKey => (
          <a
            key={filterKey}
            href={`#/${filterKey.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === filterKey,
            })}
            data-cy={`FilterLink${filterKey}`}
            onClick={() => setStatus(filterKey)}
          >
            {filterKey}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={onHandleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
