/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  tempTodo: Todo;
  isAdding: boolean;
  updatingTodos: { [key: number]: boolean };
  handleToggleTodo: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
}

export const TempTodoItem: React.FC<Props> = ({
  tempTodo,
  isAdding,
  updatingTodos,
  handleToggleTodo,
  handleDeleteTodo,
}) => {
  return (
    <div className="todo temp" data-cy="Todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          onChange={() => handleToggleTodo(tempTodo.id)}
          disabled={!!updatingTodos[tempTodo.id]}
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {tempTodo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(tempTodo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isAdding ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
