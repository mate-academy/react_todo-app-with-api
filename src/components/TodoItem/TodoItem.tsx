/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import './TodoItem.scss';
import { clsx } from 'clsx';
import { useState } from 'react';
import { ErrorState } from '../../types/ErrorState';

interface Props {
  todoId: number;
  title: string;
  completed: boolean;
  tempTodo?: true;
  onTodoDelete: (todoId: number) => Promise<void>;
  onError: (error: ErrorState) => void;
  onTodoToggle: (todoId: number, completed: boolean) => Promise<void>;
  todosToDelete: number[] | null;
}

export const TodoItem = ({
  todoId,
  title,
  completed,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
  onError,
  todosToDelete,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    } finally {
      setIsDeleting(false);
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

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoDelete}
      >
        ×
      </button>

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
