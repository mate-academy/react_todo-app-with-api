/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import cn from 'classnames';

import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  edit: number | null;
  editTitle: string;
  toggleTodo: (todo: TodoType) => void;
  loadingTodoIds: number[];
  handleEdit: (todo: TodoType) => void;
  setEditTitle: (value: string) => void;
  handleEditClick: (todo: TodoType) => void;
  handleDelete: (todo: TodoType) => void;
  setEdit: (value: number | null) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  edit,
  editTitle,
  toggleTodo,
  loadingTodoIds,
  handleEdit,
  setEditTitle,
  handleEditClick,
  handleDelete,
  setEdit,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
          disabled={loadingTodoIds.includes(todo.id)}
        />
      </label>

      {edit === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEdit(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            disabled={loadingTodoIds.includes(todo.id)}
            autoFocus
            onBlur={() => handleEdit(todo)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEdit(null);
                setEditTitle('');
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => handleEditClick(todo)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo)}
            disabled={loadingTodoIds.length > 0}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
