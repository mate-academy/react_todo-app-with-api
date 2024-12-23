import { Dispatch, SetStateAction } from 'react';

import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  todosLeft: number;
  todosCompleted: number;
  handleClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todosLeft,
  todosCompleted,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(filter => (
          <a
            key={filter}
            href={`#/${filter !== FilterStatus.All && filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
