import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';

type Props = {
  itemsLeft: Todo[],
  setStatus: (value: Status) => void,
  status: Status,
  completedTodos: Todo[],
  ClearCompletedHendlere: () => void,
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  setStatus,
  status,
  completedTodos,
  ClearCompletedHendlere,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft.length} items left`}
      </span>

      <TodoFilter setStatus={setStatus} status={status} />

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={ClearCompletedHendlere}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
