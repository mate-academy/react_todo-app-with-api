import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Status;
  setFilter: (item: Status) => void;
  numberOfNotCompleted: number;
  numberOfCompleted: number;
  clearCompletedTodos: (todos: Todo[]) => void;
  todos: Todo[];
  setListOfLoadingTodos: (todos: Todo[]) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filter,
  setFilter,
  numberOfNotCompleted,
  numberOfCompleted,
  clearCompletedTodos,
  todos,
  setListOfLoadingTodos,
}) => {
  const handleClearCompletedTodos = () => {
    setListOfLoadingTodos(todos.filter(todo => todo.completed));
    setTimeout(() => {
      clearCompletedTodos(todos);
      setListOfLoadingTodos([]);
    }, 500);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfNotCompleted} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!numberOfCompleted}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
