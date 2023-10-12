import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  clearCompletedTodos: () => void,
  selectedFilter: Filters;
  onSelectedFilter: (val: Filters) => void;
  errorMessage: string;
};

const filterValues: Filters[] = [
  Filters.All,
  Filters.Active,
  Filters.Completed,
];

export const TodoFilter: React.FC<Props> = ({
  todos,
  clearCompletedTodos,
  selectedFilter,
  onSelectedFilter,
  errorMessage,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {errorMessage ? (
        <div data-cy="ErrorNotification">
          Error Message:
          {' '}
          {errorMessage}
        </div>
      ) : (
        <span className="todo-count" data-cy="TodosCounter">
          {`${todos.filter(({ completed }) => !completed).length} items left`}
        </span>
      )}

      <nav className="filter" data-cy="Filter">
        {filterValues.map((filterType) => (
          <a
            key={`filter_${filterType}`}
            data-cy={`FilterLink${filterType}`}
            href="#/"
            className={`filter__link ${selectedFilter === filterType ? 'selected' : ''}`}
            onClick={() => onSelectedFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!todos.some(({ completed }) => completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
