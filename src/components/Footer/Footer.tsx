import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  completedFilter: Filter,
  setCompletedFilter: React.Dispatch<React.SetStateAction<Filter>>,
  handleClearCompleted: () => void,
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    todos,
    completedFilter,
    setCompletedFilter,
    handleClearCompleted,
  } = props;

  const incompleteTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completeTodosLength = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${incompleteTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: completedFilter === Filter.All,
          })}
          onClick={() => setCompletedFilter(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: completedFilter === Filter.Active,
          })}
          onClick={() => setCompletedFilter(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: completedFilter === Filter.Completed,
          })}
          onClick={() => setCompletedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {completeTodosLength !== 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
