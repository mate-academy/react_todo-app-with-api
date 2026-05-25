/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  onRename: (todo: Todo, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onToggle,
  editingTodoId,
  setEditingTodoId,
  onRename,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);

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
          onChange={() => onToggle(todo)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            onRename(todo, editedTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            autoFocus
            onBlur={() => onRename(todo, editedTitle)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditedTitle(todo.title);
                setEditingTodoId(null);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
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
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
