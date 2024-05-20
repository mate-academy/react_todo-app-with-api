import { FC } from 'react';
import { StatusSelect } from '../../types/Todo';

import './Footer.scss';

import { useAppContext, useDeleteCompleted } from '../../hooks';

export const Footer: FC = () => {
  const { todos, setStatus, status } = useAppContext();

  const { onDeleteAllCompleted } = useDeleteCompleted();

  const activeTodoCount = todos.reduce(
    (acc, current) => (current.completed ? acc : acc + 1),
    0,
  );

  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${
            status === StatusSelect.All ? 'selected' : ''
          }`}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(StatusSelect.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            status === StatusSelect.Active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(StatusSelect.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            status === StatusSelect.Completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(StatusSelect.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
