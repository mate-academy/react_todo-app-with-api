import classNames from 'classnames';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filter: FilterTypes;
  handleFilter: (filter: FilterTypes) => void;
  handleError: (error: string) => void;
  handleIsUpdating: (status: boolean) => void;
  handleUpdatingIds: (ids: number[]) => void;
  handleDeleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  handleFilter,
  handleDeleteCompleted,
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
          onClick={() => handleFilter(FilterTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === FilterTypes.Active },
          )}
          onClick={() => handleFilter(FilterTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === FilterTypes.Completed },
          )}
          onClick={() => handleFilter(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
