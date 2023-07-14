import { FilterTypes } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

interface FooterProps {
  allTodos: Todo[];
  currentTodos: Todo[];
  currentFilter: FilterTypes;
  onSelectFilter: (filterType: FilterTypes) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  allTodos,
  currentTodos,
  currentFilter,
  onSelectFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${currentTodos.filter((todo) => !todo.completed).length} items left`}
    </span>

    <Filter currentFilter={currentFilter} onSelectFilter={onSelectFilter} />

    {allTodos.filter((todo) => todo.completed).length > 0 && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    )}
  </footer>
);
