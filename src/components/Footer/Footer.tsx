import classNames from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  sortBy: Filters;
  setSortBy: (arg: Filters) => void;
  activeTodos: number;
  deleteTodo: () => void;
  isCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  sortBy,
  activeTodos,
  isCompleted,
  setSortBy,
  deleteTodo,
}) => {
  const handleChangeSortBy = (filteredBy: Filters) => {
    setSortBy(filteredBy);
  };

  const filterByParam = (param: string) => {
    return sortBy === param;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}

      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterByParam('all') })}
          onClick={() => handleChangeSortBy(Filters.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterByParam('active') })}
          onClick={() => handleChangeSortBy(Filters.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterByParam('completed') })}
          onClick={() => handleChangeSortBy(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
