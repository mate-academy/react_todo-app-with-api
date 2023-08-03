import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  processing: boolean,
  onDelete: () => void,
  onRename: (title: string) => void,
  onToggle: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processing = false,
  onDelete,
  onRename,
  onToggle,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handelKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEditing(false);
    setTitle(todo.title);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title) {
      onRename(title);
    } else {
      onDelete();
    }

    setEditing(false);
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            onKeyUp={handelKeyUp}
            onBlur={handleSubmit}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}
      <div className={classNames('modal overlay', {
        'is-active': processing,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
