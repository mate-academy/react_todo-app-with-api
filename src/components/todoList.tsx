/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  sortedUserTodo: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, completed: boolean, title: string) => Promise<void>;
  isLoader: string | number | null;
  tempTitle: string;
};

export const TodoList: React.FC<Props> = ({
  sortedUserTodo,
  onDelete,
  onUpdate,
  isLoader,
  tempTitle,
}) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const startEdit = (id: number, title: string) => {
    setEditId(id);
    setEditTitle(title);
  };

  useEffect(() => {
    if (editId !== null) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editId]);

  const finishEdit = async (
    id: number,
    completed: boolean,
    originalTitle: string,
  ) => {
    const newTitle = editTitle.trim();

    if (newTitle === originalTitle.trim()) {
      setEditId(null);

      return;
    }

    if (!newTitle) {
      try {
        await onDelete(id);
        setEditId(null);
      } catch {
        //
      }

      return;
    }

    try {
      await onUpdate(id, completed, newTitle);
      setEditId(null);
    } catch {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
    originalTitle: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await finishEdit(id, completed, originalTitle);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditTitle(originalTitle);
      setEditId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedUserTodo.map(todo => {
        const isThisTodoLoading = isLoader === todo.id || isLoader === 'all';
        const isCompleted = todo.completed === true;
        const isEditing = editId === todo.id;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', 'item-enter-done', {
              completed: isCompleted,
              editing: isEditing,
            })}
          >
            <label
              htmlFor={`todoStatus-${todo.id}`}
              className="todo__status-label"
            >
              <input
                id={`todoStatus-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={isCompleted}
                onChange={() => onUpdate(todo.id, !isCompleted, todo.title)}
                disabled={isThisTodoLoading}
              />
            </label>

            {!isEditing && (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => startEdit(todo.id, todo.title)}
              >
                {todo.title}
              </span>
            )}

            {isEditing && (
              <input
                data-cy="TodoTitleField"
                ref={inputRef}
                type="text"
                className="edit-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={() => finishEdit(todo.id, isCompleted, todo.title)}
                onKeyDown={e => onKeyDown(e, todo.id, isCompleted, todo.title)}
                autoFocus
              />
            )}

            {!isEditing && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
                disabled={isThisTodoLoading}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal', 'overlay', {
                'is-active': isThisTodoLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {isLoader === 'temp' && (
        <div data-cy="Todo" className="todo temp-item-enter-done">
          <label htmlFor="todoStatus-temp" className="todo__status-label">
            <input
              id="todoStatus-temp"
              type="checkbox"
              className="todo__status"
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTitle}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
