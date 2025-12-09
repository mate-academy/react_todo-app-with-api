import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;

  onUpdate: (id: number, data: Partial<Todo>) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;

  isTemporary?: boolean;
  isProcessing?: boolean;

  /* EDITING API */
  editingId: number | null;
  editingTitle: string;
  startEditing: (id: number, title: string) => void;
  changeEditingTitle: (value: string) => void;
  submitEditing: () => void;
  cancelEditing: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  isTemporary = false,
  isProcessing = false,

  editingId,
  editingTitle,
  startEditing,
  changeEditingTitle,
  submitEditing,
  cancelEditing,
}) => {
  const { id, title, completed } = todo;

  const isEditing = editingId === id;
  const showLoader = isTemporary || isProcessing;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (isEditing) {
      return;
    }

    await onUpdate(id, { completed: !completed });
  };

  const handleDelete = async () => {
    if (isEditing) {
      return;
    }

    await onDelete(id);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitEditing();
    }

    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = () => {
    submitEditing();
  };

  return (
    <li
      data-cy="Todo"
      className={`
        todo
        ${completed ? 'completed' : ''}
        ${isEditing ? 'editing' : ''}
      `}
    >
      {/* Checkbox label */}
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          disabled={showLoader}
        />
      </label>

      {/* VIEW MODE */}
      {!isEditing && (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => startEditing(id, title)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={showLoader}
          >
            ×
          </button>
        </>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <input
          ref={inputRef}
          className="todo__title-edit"
          data-cy="TodoTitleField"
          type="text"
          value={editingTitle}
          onChange={e => changeEditingTitle(e.target.value)}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          disabled={showLoader}
        />
      )}

      {/* Loader */}
      <div
        data-cy="TodoLoader"
        className={`todo__loader ${showLoader ? 'is-active' : ''}`}
      >
        <div className="loader" />
      </div>
    </li>
  );
};
