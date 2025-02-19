/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Todo } from '../types';

type Props = {
  isLoading: boolean;
  todo: Todo;
  onDelete?: (id: Todo['id']) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
};
export const TodoItem: FC<Props> = memo(
  ({
    isLoading,
    todo: { id, completed, title, userId },
    onDelete = () => {},
    onUpdate = () => {},
  }) => {
    const [editTitleId, setEditTitleId] = useState<Todo['id'] | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      titleRef.current?.focus();

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setEditTitleId(null);
        }
      };

      if (editTitleId) {
        document.addEventListener('keyup', handleKeyUp);
      }

      return () => document.removeEventListener('keyup', handleKeyUp);
    }, [editTitleId]);

    const handleDoubleClick = (todoId: Todo['id']) => {
      setEditTitleId(todoId);
    };

    const handleSubmitForm = (e: React.FormEvent) => {
      e.preventDefault();

      if (titleRef.current?.value) {
        const titleUpdated = titleRef.current.value.trim();

        if (titleUpdated === title) {
          setEditTitleId(null);

          return;
        }

        new Promise(resolve =>
          resolve(
            onUpdate({
              id,
              completed,
              title: titleUpdated,
              userId,
            }),
          ),
        ).then(() => setEditTitleId(null));
      } else {
        onDelete(id);
      }
    };

    return (
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo ', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            id="todoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() =>
              onUpdate({ id, completed: !completed, title, userId })
            }
          />
        </label>

        {editTitleId === id ? (
          <form onSubmit={handleSubmitForm}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              defaultValue={title}
              ref={titleRef}
              disabled={isLoading}
              onBlur={handleSubmitForm}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              data-title-id={id}
              onDoubleClick={() => handleDoubleClick(id)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
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
  },
);

TodoItem.displayName = 'TodoItemMemo';
