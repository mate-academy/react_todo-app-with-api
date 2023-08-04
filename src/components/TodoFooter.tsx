/* eslint-disable react/jsx-one-expression-per-line */
import classNames from 'classnames';
import { MouseEvent } from 'react';
import { useTodoContext } from '../hooks/useTodoContext';
import { TodoStatus } from '../types/Todo';

const TodoFooter = () => {
  const {
    selectedStatus,
    todosContainer,
    completedTodos,
    filterByStatus,
    onDeleteCompleted,
  } = useTodoContext();

  const handleChangeStatus = (e: MouseEvent, status: TodoStatus) => {
    e.preventDefault();
    filterByStatus(status);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todosContainer.length - completedTodos.length} items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.All,
          })}
          onClick={(e) => handleChangeStatus(e, TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.Active,
          })}
          onClick={(e) => handleChangeStatus(e, TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedStatus === TodoStatus.Completed,
          })}
          onClick={(e) => handleChangeStatus(e, TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos.length === 0}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
