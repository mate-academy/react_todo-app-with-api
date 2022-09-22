import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  completedTodos: Todo[],
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  removeTodo: (todoId: number) => Promise<void>,
};

export const Footer: React.FC<Props> = ({
  todos,
  completedTodos,
  filter,
  setFilter,
  removeTodo,
}) => {
  const activeTodos = todos?.filter(todo => !todo.completed);

  const getOpacityValue = () => {
    if (completedTodos) {
      return completedTodos.length > 0 ? 1 : 0;
    }

    return 0;
  };

  const removeCompletedTodos = () => {
    if (completedTodos) {
      completedTodos.forEach(async (todo) => {
        await removeTodo(todo.id);
      });
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos?.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.all,
          })}
          onClick={() => {
            setFilter(Filter.all);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.active,
          })}
          onClick={() => {
            setFilter(Filter.active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.completed,
          })}
          onClick={() => {
            setFilter(Filter.completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ opacity: getOpacityValue() }}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
