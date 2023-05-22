import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  onUpdate: (todo: Todo) => void,
  userId: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  userId,
  onUpdate,
}) => {
  const [editing, setIsEditing] = useState<boolean>(false);

  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onUpdate({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×

      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': userId,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
