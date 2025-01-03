import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
interface Props {
  todo: TodoType;
  deletedTodoId: number[] | null;
  handleDelete: (id: number) => Promise<boolean>;
  activeChangeId: number | null;
  setActiveChangeId: (id: number) => void;
  loaderId: number[];
  updateStatus: (todo: TodoType) => void;
  editedTodo: string;
  setEditedTodo: (title: string) => void;
  handleEdit: (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: TodoType,
  ) => void;
  edit: (todo: TodoType) => Promise<void>;
}

export const Todo: React.FC<Props> = ({
  todo,
  deletedTodoId,
  setActiveChangeId,
  activeChangeId,
  handleDelete,
  loaderId,
  updateStatus,
  editedTodo,
  setEditedTodo,
  handleEdit,
  edit,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${classNames({ completed: todo.completed })}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => updateStatus(todo)}
          checked={todo.completed}
        />
      </label>

      {activeChangeId !== todo.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setActiveChangeId(todo.id);
            setEditedTodo(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder={todo.title}
            value={editedTodo}
            onChange={event => setEditedTodo(event.target.value)}
            onBlur={() => edit(todo)}
            onKeyDown={event => handleEdit(event, todo)}
            autoFocus
          />
        </form>
      )}

      {!activeChangeId && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            loaderId.includes(todo.id) || deletedTodoId?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
