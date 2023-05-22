import classNames from 'classnames';
// import { useState } from 'react';
import { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDelete?: (id: number) => void,
  onUpdate?: (todo: Todo) => void,
  userId: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  userId,
  onUpdate,
}) => {
  const [editing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState(todo.title);

  function saveChanges(event: React.FormEvent) {
    event.preventDefault();
    setIsEditing(false);

    if (title === todo.title) {
      return;
    }

    if (title) {
      onUpdate?.({ ...todo, title });
    } else {
      onDelete?.(todo.id);
    }
  }

  return (
    <div
      key={todo?.id}
      className={classNames('todo', {
        completed: todo?.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {
            onUpdate?.({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {editing
        ? (
          <form onSubmit={saveChanges}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={saveChanges}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo?.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete?.(todo.id)}
            >
              ×

            </button>
          </>
        )}

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
