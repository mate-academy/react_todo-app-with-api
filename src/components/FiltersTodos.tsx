// import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  completedTodos: Todo[],
  handelClearAllComplered: () => void;
  filter: string,
  setFilter: (filter: string) => void,
}

export const FiltersTodos: React.FC<Props> = (props) => {
  const {
    todos,
    completedTodos,
    handelClearAllComplered,
    filter,
    setFilter,
  } = props;

  const handelFiltredTodos = (
    // event: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>>,
    event: any,
  ) => {
    setFilter(event.target.textContent);
  };

  return (
    <>
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === 'All' },
          )}
          onClick={handelFiltredTodos}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === 'Active' },
          )}
          onClick={handelFiltredTodos}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === 'Completed' },
          )}
          onClick={handelFiltredTodos}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handelClearAllComplered}
        style={{ visibility: completedTodos.length > 0 ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </>
  );
};
