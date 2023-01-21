import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo,
  onDeleteTodo(id: number): void,
  isLoading: boolean,
  onChangeStatus(id: number, status: boolean): void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  onChangeStatus,
}) => {
  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onChangeStatus(todo.id, todo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {!isLoading && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => onDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
