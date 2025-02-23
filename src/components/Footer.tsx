import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  typeFilter: FilterType;
  setTypeFilter: (typeFilter: FilterType) => void;
  isAllActive: boolean;
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  typeFilter,
  setTypeFilter,
  isAllActive,
  onDeleteCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  let isDeletionCompleted = false;

  const handleDeleteCompleted = () => {
    isDeletionCompleted = true;
    onDeleteCompleted();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTypeFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTypeFilter(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: typeFilter === FilterType.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTypeFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDeletionCompleted || isAllActive}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
