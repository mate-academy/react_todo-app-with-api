import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter,
  onSetFilter: (filter: Filter) => void,
  completedTodos: Todo[],
  onRemoveAll: (userId: number) => void,
  activeTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  filter,
  onSetFilter,
  completedTodos,
  onRemoveAll,
  activeTodos,
}) => {
  const removeAllcompleted = () => {completedTodos.forEach(todo => onRemoveAll(todo.id))};
  const onFilterChange = (filterStatus: Filter) => () => {
    onSetFilter(filterStatus);
  };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos.length} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              {
                selected: filter === Filter.All,
              },
            )}
            onClick={onFilterChange(Filter.All)}
          > 
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              {
                selected: filter === Filter.Active,
              },
            )}
            onClick={onFilterChange(Filter.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              {
                selected: filter === Filter.Completed,
              },
            )}
            onClick={onFilterChange(Filter.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={!completedTodos.length}
          onClick={removeAllcompleted}
        >
          Clear completed
        </button>
      </footer>
    );
};
