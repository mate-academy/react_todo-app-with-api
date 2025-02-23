import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  activeTodosCount: Todo[];
  filter: FilterBy;
  onFilter: (selectedFilter: FilterBy) => void;
  onDelete: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  filter,
  onFilter,
  onDelete,
}) => {
  const allTodosCompleted = todos.filter(todo => todo.completed);

  const handleDeleteCompletedTodos = () => {
    allTodosCompleted.forEach(todo => onDelete(todo.id));
  };

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount.length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filter === FilterBy.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onFilter(FilterBy.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filter === FilterBy.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onFilter(FilterBy.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filter === FilterBy.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onFilter(FilterBy.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompletedTodos}
          disabled={!allTodosCompleted.length}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
