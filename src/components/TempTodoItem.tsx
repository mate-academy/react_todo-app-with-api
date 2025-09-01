/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface TempTodoItemProps {
  tempTodo: Todo;
}

export const TempTodoItem: React.FC<TempTodoItemProps> = ({ tempTodo }) => {
  return (
    <div className="todo" data-cy="Todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
          disabled
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>
      <button type="button" className="todo__remove">
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
