import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { Nav } from '../Nav';

type Props = {
  completedTodos:Todo[],
  visibleTodos: Todo[],
  filterType: FilterType,
  onSetFilterType: (filter: FilterType) => void,
  onDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  onDeleteCompletedTodos,
  visibleTodos,
  filterType,
  onSetFilterType,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleTodos.length - completedTodos.length} items left`}
      </span>

      <Nav
        filterType={filterType}
        onSetFilterType={onSetFilterType}
      />
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodos}
      >
        {completedTodos.length > 0 && (
          'Clear completed'
        )}
      </button>
    </footer>
  );
};
