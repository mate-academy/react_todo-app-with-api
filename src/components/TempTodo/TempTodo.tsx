import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodoId?: number | null;
}

export const TempTodo: React.FC<Props> = ({
  todo,
  loadingTodoId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id, title } = todo;

  useEffect(() => {
    if (loadingTodoId === id) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodoId]);

  return (
    <div
      className="todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>
      <span
        className="todo__title"
      >
        {title}
      </span>
      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
