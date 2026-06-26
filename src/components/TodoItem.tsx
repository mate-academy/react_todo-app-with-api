import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => Promise<void>;
  isProcessed?: boolean;
  isLoading?: boolean;
  onToggle: (id: number) => void;
  handleUpdate: (todo: Todo) => Promise<void> | void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed,
  isLoading,
  onToggle,
  handleUpdate,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditingTitle(todo.title);
  }, [todo.title]);

  const handleSave = async () => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      try {
        if (onDelete) {
          await onDelete(todo.id);
        }

        setIsEditing(false);
      } catch {}

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await handleUpdate({ ...todo, title: trimmedTitle });
      setIsEditing(false);
    } catch {}
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditingTitle(todo.title);
      setIsEditing(false);
    }

    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__input"
          autoFocus
          value={editingTitle}
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={handleSave}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          onClick={() => onDelete?.(todo.id)}
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}

      {isProcessed && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
