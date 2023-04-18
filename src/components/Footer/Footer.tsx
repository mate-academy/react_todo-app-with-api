import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  numActiveTodos: number;
  numCompletedTodos: number;
  statusFilter: FilterType;
  todos: Todo[];
  onClickFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  numActiveTodos,
  numCompletedTodos,
  statusFilter,
  todos,
  onClickFilter,
  onClearCompleted,
}) => {
  return (
    <footer
      className="todoapp__footer"
      hidden={!todos.length}
    >
      <span className="todo-count">
        {`${numActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === FilterType.All && 'selected'}`}
          onClick={() => onClickFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === FilterType.Active && 'selected'}`}
          onClick={() => onClickFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === FilterType.Completed && 'selected'}`}
          onClick={() => onClickFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        disabled={!numCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
