import cn from 'classnames';
import { Filter, Todo } from '../../types/Todo';

type FooterProps = {
  counter: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handleClearCompleted: () => void;
  todos: Todo[];
};

export const Footer: React.FC<FooterProps> = (
  {
    counter, filter, setFilter, handleClearCompleted, todos,
  },
) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counter} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'All' })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'Active' })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'Completed' })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>

    </footer>
  );
};
