import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  status: TodoStatus,
  setStatus: (value: TodoStatus) => void,
  todos: Todo[],
  clearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  todos,
  clearCompletedTodos,
}) => {
  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  const completedTodoCount = todos.filter(todo => todo.completed).length;

  const handleStatusAll = () => {
    setStatus(TodoStatus.All);
  };

  const handleStatusActive = () => {
    setStatus(TodoStatus.Active);
  };

  const handleStatusCompleted = () => {
    setStatus(TodoStatus.Completed);
  };

  const handleClearCompleteTodos = () => {
    clearCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodoCount} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === TodoStatus.All,
          })}
          onClick={handleStatusAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === TodoStatus.Active,
          })}
          onClick={handleStatusActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === TodoStatus.Completed,
          })}
          onClick={handleStatusCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--hidden': completedTodoCount < 1,
        })}
        onClick={handleClearCompleteTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
