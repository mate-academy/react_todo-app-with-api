import classNames from 'classnames';
import { FilterStatus } from '../types/Todo';

type Props = {
  filterStatus: string;
  setFilterStatus: (status: FilterStatus) => void;
  todosLenght: number;
  isClearButtonDisabled: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todosLenght,
  isClearButtonDisabled,
  onClearCompleted,
}) => {
  const handleFilterChange = (filter: FilterStatus) => {
    setFilterStatus(filter);
  };

  const filterLinkCreation = (value: FilterStatus): string => {
    return value === FilterStatus.All ? '' : value;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLenght} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(value => (
          <a
            key={value}
            href={`#/${filterLinkCreation(value)}`}
            className={classNames('filter__link', {
              selected: filterStatus === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => handleFilterChange(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearButtonDisabled}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
