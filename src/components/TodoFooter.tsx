import React from 'react';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { Status } from '../types/Status';
import { ErrText } from '../types/ErrText';

export const TodoFooter: React.FC = () => {
  const { todos, status, setStatus, onDelete, setErrMessage } = useTodos();
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(el => el.completed);

  const handleCompleted = async () => {
    setErrMessage(ErrText.NoErr);
    let hasError = false;

    const deletePromises = completedTodos.map(async todo => {
      try {
        await onDelete(todo.id);
      } catch {
        hasError = true;
      }
    });

    await Promise.all(deletePromises);

    if (hasError) {
      setErrMessage(ErrText.DeleteErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
        {itemsLeft > 1 ? ' items left' : ' item left'}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
