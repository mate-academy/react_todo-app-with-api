import { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  isLoading?: boolean;
  onToggleTodo?: () => void;
  onUpdateTodo: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onToggleTodo,
  isLoading = false,
  onUpdateTodo,
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDeleteTodo(id);

      return;
    }

    onUpdateTodo({ ...todo, title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {
        editFieldRef.current?.focus();
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed, 'is-temp': id === 0 })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={id === 0}
          onChange={onToggleTodo}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editFieldRef}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
