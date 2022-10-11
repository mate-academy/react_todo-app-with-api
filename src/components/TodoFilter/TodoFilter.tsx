import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setFilterType: (filterType: FilterBy) => void;
  filterType: FilterBy;
  onDelete: (id: number) => void;
  completed: number[];
  setCompleted: (a: number[]) => void;
  setErrorClosing: (err: boolean) => void;
  setDelitingId: (id: number | null) => void;
};

export enum FilterBy {
  All,
  Active,
  Completed,
}

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  onDelete,
  completed,
  setErrorClosing,
  setDelitingId,
}) => {
  const { length } = todos.filter((todo) => todo.completed === false);

  const handleAllSort = () => setFilterType(FilterBy.All);
  const handleActiveSort = () => setFilterType(FilterBy.Active);
  const handleCompletedSort = () => setFilterType(FilterBy.Completed);
  const handleBulkDelete = async () => {
    const deleted = completed.map((id) => {
      setDelitingId(id);

      setTimeout(() => setDelitingId(null), 1000);

      return onDelete(id);
    });

    setErrorClosing(false);

    return deleted;
  };

  return (
    <>
      <span className="todo-count" data-cy="todosCounter">
        {`${length} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.All },
          )}
          onClick={handleAllSort}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.Active },
          )}
          onClick={handleActiveSort}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.Completed },
          )}
          onClick={handleCompletedSort}
        >
          Completed
        </a>
      </nav>
      {completed.length > 0
        ? (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleBulkDelete}
          >
            Clear completed
          </button>
        )
        : (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            style={{ visibility: 'hidden' }}
          >
            Clear completed
          </button>
        )}

    </>
  );
};
