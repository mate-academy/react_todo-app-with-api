/* eslint-disable jsx-a11y/label-has-associated-control */
import './TodoInfo.scss';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import React, { useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  isDeleting?: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, title: string, completed: boolean) => Promise<boolean>;
  isUpdating: boolean;
};

export const TodoInfo = ({
  todo,
  isProcessed,
  isDeleting,
  onDelete,
  onUpdate,
  isUpdating
}: Props) => {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditign] = useState(false);
  const isSaving = useRef(false);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditign(false);
    }
  }

  const handleSave = async () => {
    if (isSaving.current) {
      return;
    }

    isSaving.current = true;

    try {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        onDelete(todo.id);
        return;
      }

      const success = await onUpdate(todo.id, title, todo.completed);

      if (success) {
        setIsEditign(false);
      }
    } finally {
      isSaving.current = false;
    }

  }


  return (
    <>
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(event) => onUpdate(todo.id, todo.title, event.target.checked)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={async (event) => {
          event.preventDefault();
          handleSave();
        }}>
          <input
            data-cy="TodoTitleField"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleSave}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setTitle(todo.title);
              setIsEditign(true);
            }}
          >
          {todo.title}
          </span>
          <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed || isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
