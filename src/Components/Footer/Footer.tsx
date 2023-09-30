import classNames from 'classnames';
import { FilterType } from '../../utils/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
  todos: Todo[] ;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
  onDeleteCompleted,
}) => {
  const handleFiltering = (filter: FilterType) => {
    setFilterType(filter);
  };

  const todosCounter = todos.filter(todo => !todo.completed).length;

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {`${todosCounter} items left`}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => handleFiltering(FilterType.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => handleFiltering(FilterType.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => handleFiltering(FilterType.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={!todos.filter(todo => todo.completed === true).length}
      >
        Clear completed
      </button>
    </footer>
  );
};
