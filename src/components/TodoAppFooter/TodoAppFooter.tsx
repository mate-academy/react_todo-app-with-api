import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  filterType: Filter,
  handleFilter: CallableFunction,
  handleRemoveTodo: CallableFunction,
};

export const TodoAppFooter: React.FC<Props> = React.memo(({
  todos,
  filterType,
  handleFilter,
  handleRemoveTodo,
}) => {
  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const clearHandler = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.All },
          )}
          onClick={() => handleFilter(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.Active },
          )}
          onClick={() => handleFilter(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.Completed },
          )}
          onClick={() => handleFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearHandler}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
});
