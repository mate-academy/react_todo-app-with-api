import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  onFilter: (f: Filter) => void;
  count: number;
  showCCButton: boolean;
  deleteAll: () => void;
};
export const Footer: React.FC<Props> = ({
  filter,
  count,
  onFilter,
  showCCButton,
  deleteAll,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${count} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn({ selected: filter === Filter.all }, 'filter__link')}
        data-cy="FilterLinkAll"
        onClick={() => onFilter(Filter.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn({ selected: filter === Filter.active }, 'filter__link')}
        data-cy="FilterLinkActive"
        onClick={() => onFilter(Filter.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn({ selected: filter === Filter.completed },
          'filter__link')}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilter(Filter.completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={showCCButton}
      onClick={deleteAll}
    >
      Clear completed
    </button>

  </footer>
);
