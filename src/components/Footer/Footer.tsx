import cn from 'classnames';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filteredItemsCount: number;
  setFilter: (value: FilterStatus) => void;
  filterStatus: FilterStatus;
  clearCompletedTodos: () => void;
};

export const Footer:React.FC<Props> = ({
  filteredItemsCount,
  setFilter,
  filterStatus,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filteredItemsCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => {
            setFilter(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => {
            setFilter(FilterStatus.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => {
            setFilter(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          clearCompletedTodos();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
