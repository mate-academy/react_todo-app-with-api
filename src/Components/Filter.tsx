import classnames from 'classnames';
import { FilterOption } from '../types/FilterOption';
import { Todo } from '../types/Todo';

interface Props {
  countNotCompletedTodos: number,
  handleFilter: (value: string) => void,
  filter: string,
  handleRemoveCompletedTodos: () => void,
  activeTodo: Todo | undefined;
}

export const Filter: React.FC<Props> = ({
  countNotCompletedTodos,
  handleFilter,
  filter,
  handleRemoveCompletedTodos,
  activeTodo,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countNotCompletedTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filter === 'All' },
          )}
          onClick={() => handleFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filter === FilterOption.Active },
          )}
          onClick={() => handleFilter(FilterOption.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filter === FilterOption.Completed },
          )}
          onClick={() => handleFilter(FilterOption.Completed)}
        >
          Completed
        </a>
      </nav>

      {activeTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            handleRemoveCompletedTodos();
            handleFilter(FilterOption.All);
          }}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
