import { useRef, useState } from 'react';
import { Todo, TodoChanges } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => Promise<void>;
  onUpdate?: (id: number, changes: TodoChanges) => Promise<void>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const isFinishedRef = useRef(false);

  const handleSave = () => {
    if (isFinishedRef.current) {
      return;
    }

    isFinishedRef.current = true;

    const title = editTitle.trim();

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!title) {
      if (!onDelete) {
        isFinishedRef.current = false;

        return;
      }

      onDelete()
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          isFinishedRef.current = false;
        });

      return;
    }

    if (!onUpdate) {
      isFinishedRef.current = false;

      return;
    }

    onUpdate(todo.id, { title })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        isFinishedRef.current = false;
      });
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label={`Toggle ${todo.title}`}
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => {
            onUpdate?.(todo.id, {
              completed: !todo.completed,
            }).catch(() => {});
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            autoFocus
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                isFinishedRef.current = true;
                setIsEditing(false);
                setEditTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              isFinishedRef.current = false;
              setEditTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete?.().catch(() => {});
            }}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
