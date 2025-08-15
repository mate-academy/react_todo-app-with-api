import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
  onError: (message: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onUpdate,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const submitChanges = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      try {
        await onDelete(todo.id);
      } catch {
        onError('Unable to delete a todo');
      }

      return;
    }

    try {
      await onUpdate(todo.id, { title: trimmedTitle });
      setIsEditing(false);
    } catch {
      onError('Unable to update a todo');
    }
  };

  const handleStatusChange = async () => {
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch {
      onError('Unable to update a todo');
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitChanges();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const isLoading = todo.isLoading;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
          disabled={isLoading}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={submitChanges}
            onKeyDown={handleKeyDown}
            ref={editInputRef}
            disabled={isLoading}
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
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
            aria-label="Delete todo"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
