import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const escPressedRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const doSubmit = async () => {
    if (submittingRef.current || escPressedRef.current) {
      return;
    }

    const trimmed = editTitle.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    submittingRef.current = true;

    if (!trimmed) {
      try {
        await onDelete(todo.id);
      } catch {
        submittingRef.current = false;
      }

      return;
    }

    try {
      await onUpdate(todo.id, { title: trimmed });
      setIsEditing(false);
      submittingRef.current = false;
    } catch {
      submittingRef.current = false;
      editInputRef.current?.focus();
    }
  };

  const handleDoubleClick = () => {
    escPressedRef.current = false;
    submittingRef.current = false;
    setEditTitle(todo.title);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      doSubmit();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      escPressedRef.current = true;
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          ref={editInputRef}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={doSubmit}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
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
