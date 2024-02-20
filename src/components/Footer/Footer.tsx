import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TypeOfFiltering } from '../../types/TypeOfFiltering';

type Props = {
  todos: Todo[],
  setFilterType: (x: TypeOfFiltering) => void,
  filterType: TypeOfFiltering,
  onDelete: (id: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilterType: setTypeOfFiltering,
  filterType: typeOfFiltering,
  onDelete: deleteTodos,
}) => {
  const notCompletedTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isDisabled = useMemo(() => {
    return !todos.find(todo => todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={
            classNames(
              'filter__link',
              { selected: typeOfFiltering === TypeOfFiltering.All },
            )
          }
          onClick={() => {
            setTypeOfFiltering(TypeOfFiltering.All);
          }}
        >
          {TypeOfFiltering.All}
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={
            classNames(
              'filter__link',
              {
                selected: typeOfFiltering === TypeOfFiltering.Active,
              },
            )
          }
          onClick={() => setTypeOfFiltering(TypeOfFiltering.Active)}
        >
          {TypeOfFiltering.Active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={
            classNames(
              'filter__link',
              { selected: typeOfFiltering === TypeOfFiltering.Comleted },
            )
          }
          onClick={() => setTypeOfFiltering(TypeOfFiltering.Comleted)}
        >
          {TypeOfFiltering.Comleted}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={isDisabled}
        onClick={() => {
          return completedTodos.forEach(todo => deleteTodos(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
