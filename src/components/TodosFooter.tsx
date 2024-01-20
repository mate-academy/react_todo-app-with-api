import classNames from 'classnames';
import { Filters } from '../types';

export enum FILTERS {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filterBy: Filters,
  activeTodosLength: number,
  completedTodosLength: number,
  onFilterChange: (filterBy: Filters) => void
  onDeleteCompleted: () => void
};

export const TodosFooter: React.FC<Props> = ({
  filterBy,
  activeTodosLength,
  completedTodosLength,
  onFilterChange,
  onDeleteCompleted,
}) => {
  const handleOnDelete = () => {
    if (completedTodosLength) {
      onDeleteCompleted();
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map((value) => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filterBy === value,
            })}
            data-cy={`FilterLink${value.at(0)?.toUpperCase()}${value.slice(1)}`}
            onClick={() => onFilterChange(value as Filters)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodosLength <= 0}
        onClick={handleOnDelete}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
