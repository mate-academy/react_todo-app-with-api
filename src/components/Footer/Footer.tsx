import cn from 'classnames';
import { Todo } from '../../types/Todo';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filteredItemsCount: number;
  setFilter: (value: FilterStatus) => void;
  filterStatus: FilterStatus;
  clearCompletedTodos: () => void;
  todos: Todo[];
};

export const Footer:React.FC<Props> = ({
  filteredItemsCount,
  setFilter,
  filterStatus,
  clearCompletedTodos,
  todos,
}) => {
  const hasCompletedTodo = todos.some(({ completed }) => completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${filteredItemsCount} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={cn('filter__link',
                { selected: filterStatus === FilterStatus.All })}
              onClick={() => {
                setFilter(FilterStatus.All);
              }}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={cn('filter__link',
                { selected: filterStatus === FilterStatus.Active })}
              onClick={() => {
                setFilter(FilterStatus.Active);
              }}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={cn('filter__link',
                { selected: filterStatus === FilterStatus.Completed })}
              onClick={() => {
                setFilter(FilterStatus.Completed);
              }}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            disabled={!hasCompletedTodo}
            className={cn('todoapp__clear-completed', {
              'todoapp__clear-completed-hidden': !hasCompletedTodo,
            })}
            onClick={() => {
              clearCompletedTodos();
            }}
          >
            Clear completed
          </button>

        </footer>
      )}

    </>
  );
};
