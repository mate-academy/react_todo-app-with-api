import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TypeOfFiltering } from '../../types/TypeOfFiltering';
import { TodoContext } from '../../contexts/TodoContext';

export const Footer:React.FC = () => {
  const { todos, deleteData } = useContext(TodoContext);
  const { filterType, setFilterType } = useContext(TodoContext);

  const notCompletedTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isDisabled = useMemo(() => {
    return !todos.find(todo => todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const clearCompleted = () => {
    return completedTodos.forEach(todo => deleteData(todo.id));
  };

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
              { selected: filterType === TypeOfFiltering.All },
            )
          }
          onClick={() => {
            setFilterType(TypeOfFiltering.All);
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
                selected: filterType === TypeOfFiltering.Active,
              },
            )
          }
          onClick={() => setFilterType(TypeOfFiltering.Active)}
        >
          {TypeOfFiltering.Active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={
            classNames(
              'filter__link',
              { selected: filterType === TypeOfFiltering.Comleted },
            )
          }
          onClick={() => setFilterType(TypeOfFiltering.Comleted)}
        >
          {TypeOfFiltering.Comleted}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={isDisabled}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
