import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  changingIDs: number[];
  onDelete?: (id: number) => Promise<void>;
  onToggle?: (id: number, completed: boolean) => void;
  onRename?: (id: number, title: string) => Promise<void>;
  onEmptyTitleDelete?: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  changingIDs,
  onDelete = () => Promise.resolve(),
  onToggle = () => {},
  onRename = () => Promise.resolve(),
  onEmptyTitleDelete = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const { completed, id } = todo;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    setTitle(normalizedTitle);

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitle) {
      onEmptyTitleDelete();
      onDelete(id).catch(() => inputRef.current?.focus());

      return;
    }

    onRename(id, normalizedTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => inputRef.current?.focus());
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label aria-label="Todo-status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onToggle(id, completed);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => handleSubmit(event)}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={event => {
              handleSubmit(event);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
                setTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': changingIDs.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
