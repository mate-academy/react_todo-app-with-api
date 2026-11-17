/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoEditForm } from './TodoEditForm';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (todoId: number, shouldFocusNewTodo?: boolean) => Promise<boolean>;
  onToggle?: (todoId: number, completed: boolean) => void;
  onRename?: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = () => {
    if (onRename && !isProcessed) {
      setIsEditing(true);
    }
  };

  const handleSaveTitle = (title: string): Promise<boolean> => {
    if (!title) {
      return onDelete?.(todo.id, false) ?? Promise.resolve(false);
    }

    return onRename?.(todo.id, title) ?? Promise.resolve(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed || !onToggle}
          onChange={event => onToggle?.(todo.id, event.currentTarget.checked)}
        />
      </label>

      {isEditing ? (
        <TodoEditForm
          initialTitle={todo.title}
          isProcessed={isProcessed}
          onSave={handleSaveTitle}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isProcessed || !onDelete}
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
