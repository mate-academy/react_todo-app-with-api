import { memo } from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  filterTodos: (filter: Filter) => void,
  currentFilter: Filter,
  isCompletedTodos: boolean,
  activeTodosCount: number,
  deleteCompletedTodos: () => void;
  todos: Todo[],
}

export const Footer: React.FC<Props> = memo(({
  filterTodos,
  currentFilter,
  isCompletedTodos,
  activeTodosCount,
  deleteCompletedTodos,
  todos,
}) => (
  <footer
    className="todoapp__footer"
    data-cy="Footer"
    style={{ display: todos.length > 0 ? 'flex' : 'none' }}
  >
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: currentFilter === Filter.All },
        )}
        data-cy="FilterLinkAll"
        onClick={() => filterTodos(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: currentFilter === Filter.Active },
        )}
        data-cy="FilterLinkActive"
        onClick={() => filterTodos(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: currentFilter === Filter.Completed },
        )}
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
      onClick={deleteCompletedTodos}
    >
      Clear completed
    </button>

  </footer>
));
