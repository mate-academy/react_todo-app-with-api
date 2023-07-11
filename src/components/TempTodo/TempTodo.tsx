import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo;
  isLoading: boolean;
};

export const TempTodo: React.FC<Props> = ({ tempTodo, isLoading }) => {
  return (
    <div
      key={tempTodo.id}
      className={cn('todo', {
        completed: tempTodo?.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={tempTodo?.completed}
        />
      </label>

      <span className="todo__title">{tempTodo?.title}</span>

      <button type="button" className="todo__remove">
        ×
      </button>

      <div
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
