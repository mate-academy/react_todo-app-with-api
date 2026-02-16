/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  processing: boolean;
  editingId: number | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  setEditingId: (id: number | null) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onRename: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processing,
  editingId,
  editTitle,
  setEditTitle,
  setEditingId,
  onToggle,
  onDelete,
  onRename,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={processing}
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();

            if (editTitle.trim() === todo.title) {
              setEditingId(null);

              return;
            }

            onRename(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => onRename(todo)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingId(null);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(todo.id);
              setEditTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
            disabled={processing}
          >
            ×
          </button>
        </>
      )}

      {/* loader */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${processing ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
