import { FilterParams } from '../utils/filterTodos';

type Props = {
  selected: FilterParams;
  selectTodoFilter: (filter: FilterParams) => void;
};

export const Nav: React.FC<Props> = ({ selected, selectTodoFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={
          selected === 'all' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkAll"
        onClick={() => selectTodoFilter(FilterParams.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          selected === 'active' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkActive"
        onClick={() => selectTodoFilter(FilterParams.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          selected === 'completed' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkCompleted"
        onClick={() => selectTodoFilter(FilterParams.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
