import classNames from 'classnames';
import React from 'react';
import { removeTodo } from '../../api/todos';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  setStatus: (status: FilterStatus) => void;
  todos: Todo[];
  filterStatus: FilterStatus;
  setTodos: (todos: Todo[]) => void,
};

export const Footer: React.FC<Props> = ({
  setStatus,
  todos,
  filterStatus,
  setTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;

  const clearCompletedTodo = () => {
    const completedTodos = todos.filter(todo => (
      todo.completed
    ));

    const inCompletedTodos = todos.filter(todo => (
      !todo.completed
    ));

    setTodos(inCompletedTodos);

    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => setStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => setStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => setStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--hide': todos.every(x => !x.completed),
        })}
        onClick={clearCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
