import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => () => void;
  isDeleting: boolean;
  onUpdateStatus: (todo: Todo) => () => void;
  isUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting,
  onUpdateStatus: onUpdateStatus,
  isUpdating,
}) => {
  return (
    <div key={todo.id} className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={onUpdateStatus(todo)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        {(isDeleting || isUpdating) && <div className="loader" />}
      </div>
    </div>
  );
};
