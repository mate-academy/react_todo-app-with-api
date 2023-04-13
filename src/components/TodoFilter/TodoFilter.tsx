import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { SortTodoBy } from '../../types/SortTodoBy';

type Props = {
  hasCompletedTodos: boolean;
  activeTodosCount: number;
  sortBy: SortTodoBy;
  changeSortBy: Dispatch<SetStateAction<SortTodoBy>>;
  onCompletedDelete: () => void
};

export const TodoFilter: React.FC<Props> = (props) => {
  const {
    hasCompletedTodos,
    activeTodosCount,
    sortBy,
    changeSortBy,
    onCompletedDelete,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Default },
          )}
          onClick={() => changeSortBy(SortTodoBy.Default)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Active },
          )}
          onClick={() => changeSortBy(SortTodoBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortTodoBy.Completed },
          )}
          onClick={() => changeSortBy(SortTodoBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onCompletedDelete}
        style={{
          visibility: `${hasCompletedTodos ? 'visible' : 'hidden'}`,
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
