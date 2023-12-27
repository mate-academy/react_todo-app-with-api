import React from 'react';
import cn from 'classnames';
import { TypeOfFilter } from '../../types/TypeOfFilters';
import { useAppContext } from '../Context/Context';

export const TodoFooter: React.FC = () => {
  const {
    filterType,
    setFilterType,
    todos,
    deleteTodoHandler,
  } = useAppContext();

  const active = todos.filter(todo => !todo.completed);
  const completed = todos.filter(todo => todo.completed);
  const clearCompletedTodos = () => {
    completed.map(todo => deleteTodoHandler(todo.id));
  };

  const CountItems = `${active.length} items left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {CountItems}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filterType === TypeOfFilter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterType(TypeOfFilter.All)}
        >
          {TypeOfFilter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filterType === TypeOfFilter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterType(TypeOfFilter.Active)}
        >
          {TypeOfFilter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterType === TypeOfFilter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterType(TypeOfFilter.Completed)}
        >
          {TypeOfFilter.Completed}
        </a>
      </nav>

      {!!completed.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
