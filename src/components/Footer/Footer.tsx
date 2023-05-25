import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { Nav } from '../Nav';

type Props = {
  visibleTodos: Todo[]
  completedTodos:Todo[],
  filterType: FilterType,
  onSetFilterType: (filter: FilterType) => void,
  onDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  visibleTodos,
  completedTodos,
  onDeleteCompletedTodos,
  filterType,
  onSetFilterType,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {filterType === FilterType.All && (
          `${visibleTodos.length - completedTodos.length} items left`
        )}
        {filterType === FilterType.Active && (
          `${visibleTodos.length} items left`
        )}
        {filterType === FilterType.Completed && (
          '0 items left'
        )}
      </span>

      <Nav
        filterType={filterType}
        onSetFilterType={onSetFilterType}
      />
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="button is-primary is-small "
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
