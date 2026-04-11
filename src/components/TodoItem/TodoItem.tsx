/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { UNABLE_TO_UPDATE_ERROR } from '../../constants/errordata';

type Props = {
  todo: Todo;
  onDelete?: () => void;
  onToggle?: () => void;
  processingTodos?: number[];
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError?: (message: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  processingTodos = [],
  setTodos,
  showError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isProcessing = processingTodos.includes(todo.id);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const finishEditing = () => {
    const trimmed = title.trim();

    if (isUpdating) {
      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);
      return;
    }

    if (!trimmed) {
      onDelete?.();
      return;
    }

    setIsUpdating(true);

    updateTodo(todo.id, { title: trimmed })
      .then(updated => {
        setTodos?.(prev =>
          prev.map(t => (t.id === todo.id ? updated : t)),
        );

        setIsEditing(false);
      })
      .catch(() => {
        showError?.(UNABLE_TO_UPDATE_ERROR);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }

    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      ) : (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={finishEditing}
          onKeyUp={handleKeyUp}
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};