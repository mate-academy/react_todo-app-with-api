import classNames from 'classnames';
import { SortType } from '../types/SortType';

type Props = {
  countOfActiveTodo: number;
  countOfDoneTodo: number;
  removeAllDoneTodo: () => void;
  sortType: SortType;
  sortingTodos: (sort: SortType) => void;
};

export const Footer: React.FC<Props> = (props) => {
  const {
    countOfActiveTodo,
    countOfDoneTodo,
    removeAllDoneTodo,
    sortType,
    sortingTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countOfActiveTodo} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: sortType === SortType.all },
          )}
          onClick={() => sortingTodos(SortType.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: sortType === SortType.active },
          )}
          onClick={() => sortingTodos(SortType.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: sortType === SortType.completed },
          )}
          onClick={() => sortingTodos(SortType.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': countOfDoneTodo === 0 },
        )}
        onClick={removeAllDoneTodo}
      >
        Clear completed
      </button>

    </footer>
  );
};
