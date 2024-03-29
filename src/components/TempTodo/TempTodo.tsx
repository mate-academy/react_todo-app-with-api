/* eslint-disable */
import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';

export const TempTodo: React.FC = React.memo(() => {
  const { tempTodo } = useContext(TodoContext);

  return (
    <li data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
});
