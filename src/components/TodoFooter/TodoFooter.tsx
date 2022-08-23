import { FC, useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
};

export const TodoFooter: FC<Props> = ({ todos }) => {
  const complitedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className="filter__link selected"
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className="filter__link"
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className="filter__link"
        >
          Completed
        </a>
      </nav>

      {complitedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
