import { FC, memo, useCallback } from 'react';
import { Status } from '../../types/TodoFilter';
import { TodoFilter } from '../TodoFilter/TodoFilter';

interface Props {
  itemsLeft: number;
  filterBy: Status;
  onFilterChange: (newFilter: Status) => void;
  onRemoveCompletedTodos: () => Promise<void>;
}

export const Footer: FC<Props> = memo(({
  itemsLeft,
  filterBy,
  onFilterChange,
  onRemoveCompletedTodos,
}) => {
  const handleFilterChange = useCallback((newFilter: Status) => {
    onFilterChange(newFilter);
  }, []);

  const handleRemoveCompletedTodos = useCallback(() => {
    onRemoveCompletedTodos();
  }, []);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
