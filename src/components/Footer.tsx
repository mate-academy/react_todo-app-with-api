import { Filter } from './Filter';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  handleClearComplitedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  status,
  setStatus,
  handleClearComplitedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Filter status={status} setStatus={setStatus} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearComplitedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
