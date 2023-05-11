import { memo, useMemo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { Filter } from './components/Filter';
import { GetStatus } from '../../types/functions';

interface Props {
  todos: Todo[];
  status: Status;
  setStatus: GetStatus;
  clearCompleted: () => void;
}

export const Footer: FC<Props> = memo(({
  todos,
  status,
  setStatus,
  clearCompleted,
}) => {
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>
      <Filter
        status={status}
        setStatus={setStatus}
      />

      <button
        type="button"
        disabled={!hasCompleted}
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
