import classNames from 'classnames';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filter: FilterTypes;
  handleFilterChange: (filter: FilterTypes) => void;
  changeErrorText: (error: string) => void;
  handleIsUpdating: (status: boolean) => void;
  handleUpdatingIds: (ids: number[]) => void;
  deleteCompletedTodos: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  handleFilterChange,
  deleteCompletedTodos,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === FilterTypes.All },
          )}
          onClick={() => handleFilterChange(FilterTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === FilterTypes.Active },
          )}
          onClick={() => handleFilterChange(FilterTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === FilterTypes.Completed },
          )}
          onClick={() => handleFilterChange(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
