import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Filters } from '../../types/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setVisibleTodos: (param: Todo[]) => void,
  onRemoveCompleted: () => Promise<void>,
  completedTodos: Todo[],
  activeTodosCount: number,
};

export const Footer: React.FC<Props> = ({
  todos,
  setVisibleTodos,
  onRemoveCompleted,
  completedTodos,
  activeTodosCount,
}) => {
  const [filterType, setFilterType] = useState<Filters>(Filters.all);

  useEffect(() => {
    switch (filterType) {
      case Filters.all:
        setVisibleTodos(todos);
        break;

      case Filters.completed:
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;

      case Filters.active:
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;

      default:
        throw new Error('WrongType');
    }
  }, [filterType]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === Filters.all },
          )}
          onClick={() => setFilterType(Filters.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === Filters.active },
          )}
          onClick={() => setFilterType(Filters.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === Filters.completed },
          )}
          onClick={() => setFilterType(Filters.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        aria-label="ClearCompletedButton"
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            hidden: !completedTodos.length,
          },
        )}
        onClick={onRemoveCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
