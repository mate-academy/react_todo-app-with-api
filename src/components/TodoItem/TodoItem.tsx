import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <div className="todo" data-cy={TodoItem}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
        />
      </label>
      <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>
      <button
        className="todo__remove"
        data-cy="TodoDeleteButton"
        type="button"
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
