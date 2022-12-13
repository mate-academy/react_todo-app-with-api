import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { CompletedStatus } from '../../types/CompletedStatus';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setFilteredTodos: (todos: Todo[]) => void;
  remove: (id: number[]) => void;
};

export const Footer = React.memo<Props>(({
  todos,
  setFilteredTodos,
  remove,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(CompletedStatus.ALL);

  const filterByCompleteStatus = useMemo(() => {
    return [...todos].filter(todo => {
      switch (selectedStatus) {
        case CompletedStatus.ACTIVE:
          return !todo.completed;
        case CompletedStatus.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [selectedStatus, todos]);

  useEffect(() => {
    setFilteredTodos(filterByCompleteStatus);
  }, [filterByCompleteStatus]);

  const completedTodos = useMemo(() => {
    return [...todos].filter(todo => todo.completed === true);
  }, [todos]);

  const notCompletedTodos = todos.length - completedTodos.length;

  const handleClick = () => {
    const ids = [...completedTodos].map(todo => todo.id);

    remove(ids);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === CompletedStatus.ALL },
          )}
          onClick={() => setSelectedStatus(CompletedStatus.ALL)}
        >
          {CompletedStatus.ALL}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === CompletedStatus.ACTIVE },
          )}
          onClick={() => setSelectedStatus(CompletedStatus.ACTIVE)}
        >
          {CompletedStatus.ACTIVE}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === CompletedStatus.COMPLETED },
          )}
          onClick={() => setSelectedStatus(CompletedStatus.COMPLETED)}
        >
          {CompletedStatus.COMPLETED}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'notification hidden': !completedTodos.length },
        )}
        onClick={handleClick}
      >
        Clear completed
      </button>
    </footer>
  );
});
