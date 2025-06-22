import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../types/ErrorType';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (todoId: Todo['id']) => void;
  isLoading: boolean;
  onToggleStatus: (todoId: number) => void;
  onUpdateTodo: (
    todoId: Todo['id'],
    data: Partial<Omit<Todo, 'id'>>,
  ) => Promise<void>;
  setErrorMessage: (error: ErrorType) => void;
  isEditing: boolean;
  onStartEditing: (todoId: number) => void;
  onEndEditing: (todoId: number) => void;
}

export const TodoItem = ({
  todo,
  onDeleteTodo,
  isLoading,
  onToggleStatus,
  onUpdateTodo,
  setErrorMessage,
  isEditing,
  onStartEditing,
  onEndEditing,
}: TodoItemProps) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdatedError, setIsUpdatedError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(todo.title);
      inputRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEdit = async () => {
    const normalizedTitle = editedTitle.trim();

    if (normalizedTitle === todo.title) {
      onEndEditing(todo.id);

      return;
    }

    setIsProcessing(true);
    setIsUpdatedError(false);

    if (!normalizedTitle) {
      try {
        await onDeleteTodo(todo.id);
        onEndEditing(todo.id);
      } catch {
        setErrorMessage(ErrorType.DELETE_TODO);
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    try {
      await onUpdateTodo(todo.id, { title: normalizedTitle });
      onEndEditing(todo.id);
    } catch {
      setErrorMessage(ErrorType.UPDATE_TODO);
      setIsUpdatedError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlur = async () => {
    if (isProcessing || isUpdatedError) {
      return;
    }

    await handleEdit();
  };

  const handleKeyConfirm = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (isProcessing || isUpdatedError) {
        return;
      }

      await handleEdit();
    }

    if (event.key === 'Escape') {
      onEndEditing(todo.id);
      setEditedTitle(todo.title);
      setIsUpdatedError(false);
    }
  };

  const handleStartEdit = () => {
    onStartEditing(todo.id);
    setEditedTitle(todo.title);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleStatus(todo.id)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <form onSubmit={e => e.preventDefault()}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyConfirm}
            />
          </form>
        </>
      )}

      {/* Remove button appears only on hover */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
