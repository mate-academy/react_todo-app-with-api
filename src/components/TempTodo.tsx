/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo;
  loadingTodoIds: number[];
  handleCompletedTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
};
export const TempTodo: React.FC<Props> = ({
  tempTodo,
  loadingTodoIds,
  handleCompletedTodo,
  deleteTodo,
}) => {
  const { id, completed, title } = tempTodo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedTodo(tempTodo)}
        />
      </label>
      <div
        data-cy="TodoLoader"
        className={`modal overlay is-active ${loadingTodoIds.includes(id) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
    </div>
  );
};
