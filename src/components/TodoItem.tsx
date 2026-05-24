/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => Promise<boolean>;
  onRename: (id: number, title: string) => Promise<boolean>;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  onRename,
  isLoading,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(todo.title);
      titleFieldRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsSubmitting(true);

    const isSuccess = trimmedTitle
      ? await onRename(todo.id, trimmedTitle)
      : await onDelete(todo.id);

    setIsSubmitting(false);

    if (isSuccess) {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
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
        <form onSubmit={handleSubmit}>
          <input
            ref={titleFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={() => handleSubmit()}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            &times;
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
