/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, fields: Partial<TodoType>) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (isProcessing.current) {
      return;
    }

    const trimmed = editTitle.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmed) {
      isProcessing.current = true;

      onDelete(todo.id)
        .catch(() => {
          editInputRef.current?.focus();
        })
        .finally(() => {
          isProcessing.current = false;
        });

      return;
    }

    isProcessing.current = true;
    onUpdate(todo.id, { title: trimmed })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setEditTitle(todo.title);
        editInputRef.current?.focus();
      })
      .finally(() => {
        isProcessing.current = false;
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleStatusChange = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditTitle(todo.title);
              setIsEditing(true);
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
        className={classNames('modal overlay', {
          'is-active': isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
