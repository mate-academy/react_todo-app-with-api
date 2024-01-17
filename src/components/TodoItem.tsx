/* eslint-disable jsx-a11y/no-autofocus */
import React, { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  handleComplete: (id: number, completed: boolean) => void;
  isEditing: number | null;
  handleEditSubmit: (query: string, id: number) => void;
  query: string;
  setQuery: (title: string) => void;
  handleEdit: (id: number, title: string) => void;
  handleDelete: (id: number) => void;
  isUpdatingId: number[];
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  handleComplete,
  isEditing,
  handleEditSubmit,
  query,
  setQuery,
  handleEdit,
  handleDelete,
  isUpdatingId,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditSubmit(query, id);
  };

  return (
    <div
      id={`${id}`}
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          id={`${id}`}
          key={id}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
          onClick={() => {
            handleComplete(id, completed);
          }}
        />
      </label>

      {isEditing === id ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onBlur={() => {
              handleEditSubmit(query, id);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              handleEdit(id, title);
            }}
          >
            {title}
          </span>

          <button
            id={`${id}`}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isUpdatingId.some(ids => ids === id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
