import classNames from 'classnames/bind';
import React, { useMemo } from 'react';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  sortType: SortType,
  setSortType: CallableFunction,
  clearComplited: CallableFunction,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  sortType,
  setSortType,
  clearComplited,
}) => {
  const itemsLeft = useMemo(() => {
    let counter = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        counter += 1;
      }
    });

    return counter;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.default },
          )}
          onClick={() => (setSortType(SortType.default))}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.active },
          )}
          onClick={() => (setSortType(SortType.active))}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.completed },
          )}
          onClick={() => (setSortType(SortType.completed))}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => (clearComplited())}
        disabled={todos.length - itemsLeft === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
