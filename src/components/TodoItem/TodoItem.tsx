/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (todo: Todo) => Promise<void>;
  loading?: boolean;
};

export const TodoItem = React.memo(
  ({ todo, onTodoDelete, onTodoUpdate, loading = false }: Props) => {
    const isCompleted = todo.completed;
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);

    useEffect(() => {
      if (isEditing) {
        inputRef.current?.focus();
      }
    }, [isEditing]);

    const handleCompletedUpdate = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      try {
        await onTodoUpdate({
          ...todo,
          completed: event.target.checked,
        });
      } catch {}
    };

    const handleEditingStart = () => {
      setIsEditing(true);
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setTitle(todo.title);
        setIsEditing(false);
      }
    };

    type UpdateEventType =
      | React.FormEvent<HTMLFormElement>
      | React.FocusEvent<HTMLInputElement>;

    const handleTitleUpdate = async (event: UpdateEventType) => {
      event.preventDefault();

      const newTitle = title.trim();

      if (newTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      if (newTitle.length === 0) {
        onTodoDelete(todo.id);

        return;
      }

      try {
        await onTodoUpdate({
          ...todo,
          title: newTitle,
        });

        setTitle(newTitle);
        setIsEditing(false);
      } catch {}
    };

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: isCompleted })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={handleCompletedUpdate}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleTitleUpdate}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onKeyUp={handleTitleKeyUp}
              onBlur={handleTitleUpdate}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleEditingStart}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onTodoDelete(todo.id)}
              disabled={loading}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
