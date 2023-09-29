import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  temporaryTodo: Todo | null;
};

export const TodoTemporary = ({ temporaryTodo }: Props) => {
  if (temporaryTodo !== null) {
    return (
      <div
        data-cy="Todo"
        className={cn('todo', { completed: temporaryTodo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={temporaryTodo.completed}
            readOnly
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {temporaryTodo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return null;
};
