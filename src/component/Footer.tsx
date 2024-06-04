import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { Errors } from '../types/ErrorsTodo';

export const Footer: React.FC = () => {
  const { todos, status, setStatus, deleteTodo, setErrorMessage } = useTodos();
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompleted = async () => {
    try {
      await Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch {
      setErrorMessage(Errors.DeleteTodo);
    } finally {
      setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);
    }
  };

  const handleFilterClick = (newStatus: Status) => {
    setStatus(newStatus);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} item${todosLeft === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(filterStatus => (
          <a
            key={filterStatus}
            href={`#/${filterStatus.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === filterStatus,
            })}
            data-cy={`FilterLink${filterStatus}`}
            onClick={() => handleFilterClick(filterStatus)}
          >
            {filterStatus}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
