/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface PropsTodoItem {
  todo: Todo;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  handlePatch: (id: number, newTitle: string) => Promise<Todo | null>;
  loadingTodos: number[];
}

export const TodoItem: React.FC<PropsTodoItem> = ({
  todo,
  handleToggle,
  handleDelete,
  handlePatch,
  loadingTodos,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);
  const [initialTitle, setInitialTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
    setInitialTitle(todo.title);
  };

  const saveTitle = async () => {
    if (isSaving) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      await handleDelete(todo.id);

      return;
    }

    setIsSaving(true);

    const resp = await handlePatch(todo.id, trimmedTitle);

    if (resp) {
      setIsSaving(false);
      setIsEditing(false);
    } else {
      alert('Unable to update a todo');
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await saveTitle();
    }

    if (event.key === 'Escape') {
      isCancelledRef.current = true;
      setTitle(initialTitle);
      setIsEditing(false);

      if (isSaving || title.trim() === todo.title) {
        return;
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.preventDefault();

    if (isCancelledRef.current) {
      isCancelledRef.current = false;

      return;
    }

    if (!isSaving && title.trim() !== todo.title && isEditing) {
      saveTitle();
    } else {
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
          onChange={() => handleToggle(todo.id)}
          disabled={loadingTodos.includes(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="todo__title-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyUp={handleKeyDown}
          data-cy="TodoTitleField"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEditing}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingTodos.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
