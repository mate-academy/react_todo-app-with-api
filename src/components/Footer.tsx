import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { useTodosContext } from '../context/useTodosContext';

export const Footer: React.FC = () => {
  const { todos, query, setQuery, removeTodo } = useTodosContext();
  const completedIds = todos
    .filter(item => item.completed)
    .map(item => item.id);
  const activeTodosQuantity = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const handleDeleteCompletedTodos = () => {
    completedIds.forEach(id => removeTodo(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: query === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setQuery(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedIds.length === 0}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
