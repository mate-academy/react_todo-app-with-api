/* eslint-disable react/self-closing-comp */
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';

type Props = {
  status: Status;
  onChangeStatus: (state: Status) => void;
  activeTodos: Todo[];
  onClear: () => Promise<void>
  completedTodos: Todo[]
};

export const Footer: React.FC<Props> = ({
  status,
  onChangeStatus,
  activeTodos,
  onClear,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter status={status} onChangeStatus={onChangeStatus} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !completedTodos.length,
        })}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
