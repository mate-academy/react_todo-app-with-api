import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => void;
  handleUpdate: (id: number, newTitle?: string, completed?: boolean) => void;
  setEditingId: (id: number | null) => void;
  deletingId: number | null;
  updatingId: number | null;
  editingId: number | null;
};

export const TodoList = ({
  todos,
  handleDelete,
  deletingId,
  handleUpdate,
  updatingId,
  editingId,
  setEditingId,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => {
        const isDeleting = deletingId === todo.id;
        const isUpdating = updatingId === todo.id;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              {/* eslint-disable jsx-a11y/label-has-associated-control*/}
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  handleUpdate(todo.id, undefined, !todo.completed);
                }}
              />
            </label>

            {editingId === todo.id ? (
              <input
                autoFocus
                data-cy="TodoTitleField"
                type="text"
                defaultValue={todo.title}
                className="todo__title-field"
                onBlur={event => {
                  const value = event.currentTarget.value;
                  const newTitle = value.trim();

                  if (!newTitle) {
                    handleDelete(todo.id);

                    return;
                  }

                  if (newTitle === todo.title) {
                    setEditingId(null);

                    return;
                  }

                  handleUpdate(todo.id, newTitle);
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    const value = event.currentTarget.value;
                    const newTitle = value.trim();

                    if (!newTitle) {
                      handleDelete(todo.id);

                      return;
                    }

                    if (newTitle === todo.title) {
                      setEditingId(null);

                      return;
                    }

                    handleUpdate(todo.id, newTitle);
                  }

                  if (event.key === 'Escape') {
                    setEditingId(null);

                    return;
                  }
                }}
              />
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setEditingId(todo.id)}
              >
                {todo.title}
              </span>
            )}

            {/* Remove button appears only on hover */}
            {editingId !== todo.id && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  handleDelete(todo.id);
                }}
              >
                ×
              </button>
            )}

            {/* overlay will cover the todo while it is being deleted or updated */}
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
      })}
    </section>
  );
};
