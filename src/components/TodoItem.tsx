/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<void>;
  loadingTodoId: number | null;
  updateTodo: (updatedTodo: Todo) => Promise<Todo>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingTodoId,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const startEdit = () => {
    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const finishEdit = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      deleteTodo(todo.id).catch(() => {
        setIsEditing(true);
      });

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    updateTodo({
      ...todo,
      title: trimmed,
    })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setIsEditing(true);
        setEditedTitle(todo.title);
      });
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
          onChange={() =>
            updateTodo({
              ...todo,
              completed: !todo.completed,
            })
          }
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              finishEdit();
            }

            if (e.key === 'Escape') {
              cancelEdit();
            }
          }}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          data-cy="TodoDelete"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
