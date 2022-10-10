import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  filterType: FilterType;
  setfilterType: (type: FilterType) => void;
  todos: Todo[];
  handleDelete: (id: number)=> void;
  isActive: Todo[],
};

export const Filter: React.FC<Props> = ({
  filterType,
  setfilterType,
  todos,
  handleDelete,
  isActive,
}) => {
  const clearCompleted = () => todos
    .forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${isActive.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            'filter__link selected': filterType === FilterType.All,
          })}
          onClick={() => setfilterType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            'filter__link selected': filterType === FilterType.Active,
          })}
          onClick={() => setfilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            'filter__link selected': filterType === FilterType.Completed,
          })}
          onClick={() => setfilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        {(todos.some(todo => todo.completed))
         && 'Clear completed'}
      </button>
    </footer>
  );
};
