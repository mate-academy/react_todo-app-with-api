/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDeleteTodo?: (id: number) => void;
  loading?: boolean;
  onUpdateTodo?: (todo: Todo) => Promise<void>;
  onToggleTodo?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    loading,
    onDeleteTodo = () => {},
    onUpdateTodo = () => Promise.resolve(),
    onToggleTodo = () => {},
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);

    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing) {
        editInputRef.current?.focus();
      }
    }, [isEditing]);

    const saveChanges = () => {
      const cleanTitle = editTitle.trim();

      if (cleanTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      if (!cleanTitle) {
        onDeleteTodo(todo.id);

        return;
      }

      onUpdateTodo({ ...todo, title: cleanTitle })
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          editInputRef.current?.focus();
        });
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditTitle(todo.title);
        setIsEditing(false);
      }
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      saveChanges();
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
            aria-label="Todo status"
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={editInputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={saveChanges}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
        )}

        {!isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
