import { StatusFilter } from '../../types/StatusFilter';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter';

interface Props {
  activeTodos: Todo[];
  selectedFilter: StatusFilter;
  completedTodos: Todo[];
  deleteCompletedTodos: () => void;
  setSelectedFilter: (filter: StatusFilter) => void;
}

export const Footer: React.FC <Props> = ({
  activeTodos,
  selectedFilter,
  completedTodos,
  deleteCompletedTodos,
  setSelectedFilter,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodos.length} items left`}
    </span>

    <Filter
      setSelectedFilter={setSelectedFilter}
      selectedFilter={selectedFilter}
    />

    {completedTodos && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    )}

  </footer>
);
