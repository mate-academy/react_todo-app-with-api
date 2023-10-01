import cn from 'classnames';
import { Filter, Todo } from '../../types/Todo';

type FooterProps = {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'All' })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'Active' })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>

    </footer>
  );
};
