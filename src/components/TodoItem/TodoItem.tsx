import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Item } from '../../types/Todo';

type Props = {
  item: Item,
  isProcessed?: boolean,
  onChange?: (todo: Item) => void,
  onRemove?: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  item,
  isProcessed = false,
  onChange = () => {}, onRemove = () => {},
}) => {
  const [editing, setEditing] = useState(false);
  const fieldRef = useRef<HTMLInputElement>(null);

  const {
    id, title, completed,
  } = item;

  const handleChangeTitle = () => {
    if (fieldRef.current) {
      const trimmedTitle = fieldRef.current.value.trim();

      if (!trimmedTitle) {
        onRemove(id);
      } else if (trimmedTitle !== title) {
        onChange({ ...item, title: trimmedTitle });
      } else {
        setEditing(false);
      }
    }
  };

  const handleFieldKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setEditing(false);
        break;
      case 'Enter':
        handleChangeTitle();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (editing && fieldRef.current) {
      if (fieldRef.current.value.trim() === title) {
        setEditing(false);

        return;
      }

      fieldRef.current.focus();
      fieldRef.current.value = title;
    }
  }, [editing, title]);

  return (
    <div className={cn('todo', { completed })} data-cy="Todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChange({ ...item, completed: !completed })}
        />
      </label>

      {editing ? (
        <input
          ref={fieldRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          onBlur={handleChangeTitle}
          onKeyUp={handleFieldKeyUp}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
