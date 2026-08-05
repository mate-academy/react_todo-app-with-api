/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo, TodoUpdate } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onUpdate?: (todoId: number, data: TodoUpdate) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);
  const isSaving = useRef(false);
  const isCancelling = useRef(false);

  useEffect(() => {
    if (isEditing) {
      titleField.current?.focus();
      titleField.current?.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setNewTitle(todo.title);
    isCancelling.current = false;
    setIsEditing(true);
  };

  const cancelEditing = () => {
    isCancelling.current = true;
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const saveTitle = async () => {
    if (isSaving.current || isCancelling.current) {
      return;
    }

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    isSaving.current = true;

    const isSuccessful = normalizedTitle
      ? await onUpdate?.(todo.id, { title: normalizedTitle })
      : await onDelete?.(todo.id);

    isSaving.current = false;

    if (isSuccessful) {
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={saveTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
