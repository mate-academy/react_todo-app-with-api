/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import './TodoItem.scss';
import { clsx } from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { ErrorState } from '../../types/ErrorState';

interface Props {
  todoId: number;
  title: string;
  completed: boolean;
  tempTodo?: true;
  onTodoDelete: (todoId: number) => Promise<void>;
  onError: (error: ErrorState) => void;
  onTodoToggle: (todoId: number, completed: boolean) => Promise<void>;
  onTodoTitleUpdate: (todoId: number, title: string) => Promise<void>;
  todosToDelete: number[] | null;
}

export const TodoItem = ({
  todoId,
  title,
  completed,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
  onTodoTitleUpdate,
  onError,
  todosToDelete,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [temptTitle, setTemptTitle] = useState(title);

  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTodoToggle = async () => {
    setIsUpdating(true);

    try {
      await onTodoToggle(todoId, !completed);
    } catch {
      onError({
        message: 'Unable to update a todo',
        isVisible: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTodoDelete = async () => {
    setIsDeleting(true);

    try {
      await onTodoDelete(todoId);
    } catch {
      onError({
        message: 'Unable to delete a todo',
        isVisible: true,
      });

      throw new Error();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemptTitle(e.target.value);
  };

  const updateTodo = async () => {
    if (title === temptTitle) {
      setIsEditing(false);

      return;
    }

    if (temptTitle.length === 0) {
      try {
        await handleTodoDelete();
      } catch {
        editInputRef.current?.focus();
      }

      return;
    }

    try {
      setIsUpdating(true);

      await onTodoTitleUpdate(todoId, temptTitle.trim());

      setIsEditing(false);
    } catch {
      onError({
        message: 'Unable to update a todo',
        isVisible: true,
      });

      editInputRef.current?.focus();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateTodo();
  };

  const handleTodoSelect = () => {
    setIsEditing(true);
  };

  const handleTodoBlur = () => {
    updateTodo();
  };

  const handleTodoKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const willBeDeleted = todosToDelete?.includes(todoId);

  return (
    <div
      data-cy="Todo"
      className={clsx('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoToggle}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form className="todo__edit-form" onSubmit={handleEditFormSubmit}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            ref={editInputRef}
            placeholder="Empty todo will be deleted"
            value={temptTitle}
            onChange={handleTodoChange}
            onBlur={handleTodoBlur}
            onKeyUp={handleTodoKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleTodoSelect}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleTodoDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={clsx('modal', 'overlay', {
          'is-active': tempTodo || isDeleting || willBeDeleted || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
