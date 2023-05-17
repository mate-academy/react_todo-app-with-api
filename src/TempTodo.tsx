import React from 'react';
import clasnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  tempTodo: Todo;
  loadingTodoIds: number[];
};

export const TempTodo: React.FC<Props> = ({
  tempTodo,
  loadingTodoIds,
}) => {
  const {
    title,
    completed,
    id,
  } = tempTodo;

  return (
    <div
      className={clasnames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button type="button" className="todo__remove">×</button>

      <div
        className={clasnames('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
