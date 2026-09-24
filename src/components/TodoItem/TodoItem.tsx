/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onToggle?: (todoId: number) => void;
  onRename?: (todoId: number, title: string) => Promise<void>;
};

export const TodoItem = React.memo<Props>(
  ({ todo, isProcessed = false, onDelete, onToggle, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

    const editInput = useRef<HTMLInputElement>(null);
    const isSaving = useRef(false);

    useEffect(() => {
      if (isEditing) {
        editInput.current?.focus();
      }
    }, [isEditing]);

    const cancelEditing = () => {
      setNewTodoTitle(todo.title);
      setIsEditing(false);
    };

    const save = async () => {
      if (isSaving.current) {
        return;
      }

      isSaving.current = true;

      const trimmedTitle = newTodoTitle.trim();

      if (trimmedTitle === todo.title) {
        cancelEditing();
        isSaving.current = false;

        return;
      }

      try {
        if (!trimmedTitle) {
          await onDelete?.(todo.id);
        } else {
          await onRename?.(todo.id, trimmedTitle);
        }

        setIsEditing(false);
      } catch {
        // Error notification is handled in App
      } finally {
        isSaving.current = false;
      }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void save();
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    };

    return (
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onToggle?.(todo.id)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={editInput}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              onKeyUp={handleKeyUp}
              onBlur={() => void save()}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setNewTodoTitle(todo.title);
                setIsEditing(true);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete?.(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isProcessed })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
TodoItem.displayName = 'TodoItem';
