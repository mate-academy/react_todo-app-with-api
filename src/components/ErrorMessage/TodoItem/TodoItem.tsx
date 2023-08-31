import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
  onToggleStatus: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  onDeleteTodo,
  onUpdateTitle,
  onToggleStatus,
}) => {
  const { title, id, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const preparedTitle = newTitle.trim();

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onToggleStatus(todo)}
          readOnly
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault();

          onUpdateTitle(todo, preparedTitle);
          setIsEditing(false);
        }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={({ target }) => {
              setNewTitle(target.value);
            }}
            ref={titleInputRef}
            onBlur={() => {
              onUpdateTitle(todo, preparedTitle);
              setIsEditing(false);
            }}
            onKeyUp={({ key }) => {
              if (key === 'Escape') {
                setIsEditing(false);
                setNewTitle(title);
              }
            }}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? newTitle : title}
        </span>
      )}

      {isEditing || (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <div className={cn(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
