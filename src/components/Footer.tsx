import { memo } from 'react';
import cn from 'classnames';
import { Filter } from '../types/enums/filter';

interface Props {
  filterTodos: (filter: Filter) => void,
  isCompletedTodos: boolean,
  activeTodosCount: number,
  filter: Filter,
  clearCompletedTodos: () => void,
}

export const Footer: React.FC<Props> = memo(({
  filterTodos,
  isCompletedTodos,
  activeTodosCount,
  filter,
  clearCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => filterTodos(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => filterTodos(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => filterTodos(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!isCompletedTodos}
      onClick={clearCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
));
