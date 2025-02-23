import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  onUpdate?: (todoId: number, data: Partial<Todo>) => void;
  onError?: (message: string) => void;
  isProcessed?: boolean;
  editTodoFieldRef: React.RefObject<HTMLInputElement>;
  focusEditTodoField?: () => void;
  handleEditTodo?: (todoId: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  onError,
  isProcessed = false,
  editTodoFieldRef,
  focusEditTodoField,
  handleEditTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = () => {
    onUpdate?.(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    if (editTodoFieldRef.current) {
      editTodoFieldRef.current.focus();
    } else if (focusEditTodoField) {
      focusEditTodoField();
    }
  };

  const clearFocus = React.useCallback(() => {
    if (document.activeElement && editTodoFieldRef.current) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [editTodoFieldRef]);

  useEffect(() => {
    if (isEditing && editTodoFieldRef.current) {
      editTodoFieldRef.current.focus();
    } else {
      clearFocus();
    }
  }, [isEditing, editTodoFieldRef, clearFocus]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleDelete = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete?.(todo.id);
    } catch {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editTitle.trim() === '') {
      onError?.('Title should not be empty');
      setEditTitle(todo.title);
      if (editTodoFieldRef.current) {
        editTodoFieldRef.current.focus();
      }

      setIsLoading(false);

      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate?.(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch {
      onError?.('Unable to update a todo');
      setEditTitle(todo.title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (editTitle.trim() === '') {
        await handleDelete();
      } else if (editTitle.trim() !== todo.title) {
        await handleUpdate();
        if (handleEditTodo) {
          handleEditTodo(todo.id, editTitle);
        }

        if (editTodoFieldRef.current) {
          editTodoFieldRef.current.blur();
        }
      } else {
        setIsEditing(false);
      }
    } else if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    if (editTitle.trim() !== todo.title) {
      if (editTitle.trim() === '') {
        await handleDelete();
      } else {
        await handleUpdate();
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed || isLoading}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          ref={editTodoFieldRef}
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isProcessed || isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
