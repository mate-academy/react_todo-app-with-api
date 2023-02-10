import cn from 'classnames';
import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  completedTodos: Todo[],
  filterByAll: () => void,
  filterByActive: () => void,
  filterByCompleted: () => void,
  selectedFilter: string,
  clearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  filterByAll,
  filterByActive,
  filterByCompleted,
  selectedFilter,
  clearCompletedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodos.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          { selected: selectedFilter === Filters.All },
        )}
        onClick={filterByAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          { selected: selectedFilter === Filters.Active },
        )}
        onClick={filterByActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: selectedFilter === Filters.Completed },
        )}
        onClick={filterByCompleted}
      >
        Completed
      </a>
    </nav>
    {completedTodos.length > 0 && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedTodos}

      >
        Clear completed
      </button>
    )}

  </footer>
);
