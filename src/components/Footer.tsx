import cn from 'classnames';
import { FilterBy } from '../types/FilterBy';
import { Props } from '../types/Props';

export const Footer: React.FC<Props> = ({
  todosCounter,
  filterBy,
  setFilterBy,
  todos,
  onCompletedDelete,
}) => {
  const activeTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Complited,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterBy.Complited)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onCompletedDelete}
        disabled={!(activeTodos.length > 0)}
      >
        Clear completed
      </button>

    </footer>
  );
};
