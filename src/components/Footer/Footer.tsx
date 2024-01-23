import cn from 'classnames';
import { useMemo, useState } from 'react';
import { useTodosContext } from '../TodosContext';
import { FilterType } from '../../types/EnumFilterType';
import { COUNT_TODO } from '../../utils/variablesHelpers';

export const Footer = () => {
  const {
    todos,
    setFilterType,
    deleteComplitedTodos,
  } = useTodosContext();

  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);

  const completedTodos = todos.filter(({ completed }) => completed);
  const activeTodo = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo.length > COUNT_TODO
          ? `${activeTodo.length} items left`
          : `${activeTodo.length} item left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterType(FilterType.All);
            setSelectedFilter(FilterType.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterType(FilterType.Active);
            setSelectedFilter(FilterType.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterType(FilterType.Completed);
            setSelectedFilter(FilterType.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: !completedTodos.length,
        })}
        onClick={deleteComplitedTodos}
        disabled={activeTodo.length === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
