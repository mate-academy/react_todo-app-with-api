import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  left: number;
  completed: number;
  onFilter: (type: Filter) => void;
  onClearCompleted: ()=>void;
  currentFilter: Filter;
};

export const Footer: React.FC<Props> = ({
  left, onFilter, completed, onClearCompleted, currentFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${left} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.ALL },
          )}
          onClick={() => {
            onFilter(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.ACTIVE },
          )}
          onClick={() => {
            onFilter(Filter.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.COMPLETED },
          )}
          onClick={() => {
            onFilter(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>
      <div>
        {completed !== 0 && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};
