import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({ todo, onDelete, onUpdateTodo }) => {
  return (
    <div
      className={classNames('todo',
        {
          completed: todo.completed,
        })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdateTodo(todo)}
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
