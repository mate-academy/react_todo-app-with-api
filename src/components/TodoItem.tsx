/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onToggle?: (todo: Todo) => Promise<boolean>;
  onRename?: (todo: Todo, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    isFinishedRef.current = false;
    setEditedTitle(title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    isFinishedRef.current = true;
    setEditedTitle(title);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    if (isFinishedRef.current) {
      return;
    }

    isFinishedRef.current = true;

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    const isSuccess = trimmedTitle
      ? await onRename?.(todo, trimmedTitle)
      : await onDelete?.(id);

      if (isSuccess) {
        setIsEditing(false);
      } else {
        isFinishedRef.current = false;
      }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveChanges();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={saveChanges}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
