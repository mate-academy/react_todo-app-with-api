import { Todo } from '../types/Todo';
import classNames from 'classnames';
import React from 'react';

interface Props {
  todo: Todo;
  toggleCompleted: (a: number, b: boolean) => void;
  updatingId: number | null;
  handleSave: (
    a: number,
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => void;
  updatingText: string;
  setUpdatingText: (a: string) => void;
  handleEdit: (a: number, b: string) => void;
  handleDelete: (a: number) => void;
  temp: Todo | null;
  isDeleting: boolean;
  togglingCompleted: number | null;
  setUpdatingId: (a: number | null) => void;
  errors: string;
  onKeyDown: (id: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleCompleted,
  updatingId,
  handleSave,
  updatingText,
  setUpdatingText,
  handleEdit,
  handleDelete,
  temp,
  isDeleting,
  togglingCompleted,
  errors,
  onKeyDown,
}) => {
  const todoItemClass = classNames('todo is-active', {
    completed: todo.completed,
  });

  return (
    <div key={todo.id} data-cy="Todo" className={todoItemClass}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="todo__status-label"
        onClick={() => toggleCompleted(todo.id, todo.completed)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      {updatingId === todo.id ? (
        <form onSubmit={e => handleSave(todo.id, e)}>
          <input
            type="text"
            value={updatingText}
            onChange={e => setUpdatingText(e.target.value)}
            onBlur={e => handleSave(todo.id, e)}
            onKeyDown={e => onKeyDown(todo.id, e)}
            autoFocus
            className="todo__title-field"
            data-cy="TodoTitleField"
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEdit(todo.id, todo.title)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            errors !== 'Unable to update a todo' &&
            (temp?.id === todo.id ||
              isDeleting ||
              togglingCompleted === todo.id ||
              (updatingText.length > 0 && updatingId === todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
