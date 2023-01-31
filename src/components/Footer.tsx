import cn from 'classnames';
import { useMemo } from 'react';
import { CompletedFilter } from '../types/CompletedFilter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  completedFilter: CompletedFilter;
  removeCompletedTodos: () => void;
  setCompletedFilter: (filter: CompletedFilter) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  completedFilter,
  removeCompletedTodos,
  setCompletedFilter,
}) => {
  const uncompletedTodosAmount = useMemo(() => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    return uncompletedTodos.length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosAmount} item${uncompletedTodosAmount > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: completedFilter === CompletedFilter.All })}
          onClick={() => setCompletedFilter(CompletedFilter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: completedFilter === CompletedFilter.Active })}
          onClick={() => setCompletedFilter(CompletedFilter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: completedFilter === CompletedFilter.Completed })}
          onClick={() => setCompletedFilter(CompletedFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={uncompletedTodosAmount === todos.length}
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          inVisible: uncompletedTodosAmount === todos.length,
        })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
