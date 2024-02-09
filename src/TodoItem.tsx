import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loading = false,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleStatus(todo.id)} // Викликати функцію onToggleStatus при зміні статусу
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onDelete={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
