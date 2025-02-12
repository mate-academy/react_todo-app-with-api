/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  editingId: number | null;
  changingTitle: string;
  updatingTodoIds: number[];
  deletingTodoIds: number[];
  setEditingId: (id: number | null) => void;
  setChangingTitle: (title: string) => void;
  toggleTodo: (id: number) => void;
  handleTitleChange: (id: number) => void;
  handleBlur: () => void;
  handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDelete: (id: number) => void;
  isTempTodo: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  editingId,
  changingTitle,
  updatingTodoIds,
  deletingTodoIds,
  setEditingId,
  setChangingTitle,
  toggleTodo,
  handleTitleChange,
  handleBlur,
  handleKeyUp,
  handleDelete,
  isTempTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div key={id} data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => toggleTodo(id)}
          checked={completed}
        />
      </label>

      {editingId === id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleTitleChange(id);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changingTitle}
            onChange={event => setChangingTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(id);
              setChangingTitle(title);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            updatingTodoIds.includes(id) ||
            deletingTodoIds.includes(id) ||
            isTempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
