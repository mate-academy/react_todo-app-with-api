import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todo: Todo) => Promise<void>;
  onToggle?: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete = () => {},
  onUpdate = () => Promise.resolve(),
  onToggle = () => {},
}) => {
  const { id, title, completed } = todo;

  const [editing, setEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      editInput.current?.focus();
    }
  }, [editing]);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const finishEditing = () => {
    if (isLoading) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      onDelete(id);

      return;
    }

    if (trimmedTitle === title) {
      setEditing(false);

      return;
    }

    onUpdate({ ...todo, title: trimmedTitle })
      .then(() => {
        setEditing(false);
      })
      .catch(() => {
        editInput.current?.focus();
      });
  };

  const handleEnterKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setEditedTitle(title);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    finishEditing();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editInput}
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={finishEditing}
            onKeyUp={handleEnterKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
