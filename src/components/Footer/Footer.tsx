import classNames from 'classnames';
import { SortBy } from '../../App';

type FooterProps = {
  itemsLeft: number;
  sortBy: string;
  onSortBy: (sort: SortBy) => void;
  onCleanCompleted: (clean: boolean) => void;
  todosLength: number;
};

export function Footer({
  itemsLeft,
  sortBy,
  onSortBy,
  onCleanCompleted,
  todosLength,
}: FooterProps) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(SortBy).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: sortBy === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={() => onSortBy(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosLength !== itemsLeft ? false : true}
        onClick={() => onCleanCompleted(true)}
      >
        Clear completed
      </button>
    </footer>
  );
}
