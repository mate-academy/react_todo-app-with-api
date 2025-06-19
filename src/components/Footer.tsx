import { Dispatch, SetStateAction } from 'react';
import { FilterOptions, StatusFilter } from './StatusFilter';

interface Props {
  itemsLeft: number;
  statusFiltration: FilterOptions;
  onStatusChange: Dispatch<SetStateAction<FilterOptions>>;
  completedCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  itemsLeft,
  statusFiltration,
  onStatusChange,
  completedCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <StatusFilter
        statusFiltration={statusFiltration}
        onStatusFilterChange={onStatusChange}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
