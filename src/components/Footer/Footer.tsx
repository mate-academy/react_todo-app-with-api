import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  sortBy: Filters;
  setSortBy: (arg: Filters) => void;
  todos: Todo[] | null;
  deleteTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  sortBy,
  todos,
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
        {`${todos?.length} items left`}

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

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteTodo}
      >
        {Filters.Completed && 'Clear completed'}
      </button>
    </footer>
  );
};
