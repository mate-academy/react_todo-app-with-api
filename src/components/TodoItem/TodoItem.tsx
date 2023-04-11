import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
  isLoading: boolean,
}

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onDeleteTodo,
    onUpdateTodo,
    isLoading,
  },
) => {
  const { title, completed, id } = todo;

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <div
        className={classNames(
          'modal overlay', { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>
    </div>
  );
};
