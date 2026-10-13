/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => Promise<boolean> | void;
  onToggle?: (todo: Todo, completed: boolean) => void;
  onRename?: (todo: Todo, title: string) => Promise<boolean> | void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const editingFinishedRef = useRef(false);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDelete = () => {
    onDelete?.(todo.id);
  };

  const finishEditing = async () => {
    if (editingFinishedRef.current || isLoading) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      if (!onDelete) {
        return;
      }

      editingFinishedRef.current = true;

      try {
        const result = await onDelete(todo.id);

        if (result === false) {
          editingFinishedRef.current = false;

          return;
        }

        setIsEditing(false);
      } catch {
        editingFinishedRef.current = false;
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      editingFinishedRef.current = true;
      setIsEditing(false);

      return;
    }

    if (!onRename) {
      return;
    }

    editingFinishedRef.current = true;

    try {
      const result = await onRename(todo, trimmedTitle);

      if (result === false) {
        editingFinishedRef.current = false;

        return;
      }

      setIsEditing(false);
    } catch {
      editingFinishedRef.current = false;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void finishEditing();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      editingFinishedRef.current = true;
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    void finishEditing();
  };

  const handleDoubleClick = () => {
    if (isLoading) {
      return;
    }

    editingFinishedRef.current = false;
    setTitle(todo.title);
    setIsEditing(true);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading || !onToggle}
          onChange={event => onToggle?.(todo, event.target.checked)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            disabled={isLoading}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
        </form>
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
            onClick={handleDelete}
            disabled={isLoading || !onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
