import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onClick: () => void;
  onCheckboxClick: () => void;
  onUpdate: (newTitle: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, loading },
  onClick,
  onCheckboxClick,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempTitle(title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  };

  const handleBlur = async () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = tempTitle.trim();

    if (trimmedTitle) {
      const success = await onUpdate(trimmedTitle);

      if (success) {
        setIsEditing(false);
      } else {
        setTimeout(() => inputRef.current?.focus());
      }
    } else {
      const result = await onDelete();

      if (result !== false) {
        setIsEditing(false);
      } else {
        setTimeout(() => inputRef.current?.focus());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (tempTitle.trim() === title) {
        setIsEditing(false);
      } else {
        inputRef.current?.blur();
      }
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempTitle(title);
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
          onClick={onCheckboxClick}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={tempTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onClick}
        >
          ×
        </button>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
