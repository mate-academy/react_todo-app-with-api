import classNames from 'classnames';
import { SortTodos } from '../types/SortTodos';

type Props = {
  itemsLeft: number;
  sortTodos: SortTodos;
  disabled: boolean;
  setSortTodos: (value: SortTodos) => void;
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  sortTodos,
  disabled,
  setSortTodos,
  deleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: sortTodos === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSortTodos('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: sortTodos === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSortTodos('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: sortTodos === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortTodos('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={disabled}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
