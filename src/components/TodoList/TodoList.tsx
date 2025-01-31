/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { TodoItem } from '../TodoItem';
import { useAppContext } from '../../HooksContext';

export const TodoList: React.FC = () => {
  const { loading, tempTodo } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoItem />

      {loading && tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed || false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo?.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
