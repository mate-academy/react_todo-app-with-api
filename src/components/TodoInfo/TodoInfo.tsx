import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  onCheckedChange: (todoId: number, completed: boolean) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading = true,
  onDelete,
  onCheckedChange,
}) => (
  <div
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        id={`todo-${todo.id}`}
        onClick={() => onCheckedChange(todo.id, todo.completed)}
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    <button
      type="button"
      className="todo__remove"
      onClick={() => onDelete(todo.id)}
      disabled={isLoading}
    >
      ×
    </button>

    <div className={classNames('modal overlay', {
      'is-active': isLoading,
    })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
