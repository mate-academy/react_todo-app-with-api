import React from 'react';
import classNames from 'classnames';
import { TodoRich } from '../../types/TodoRich';
import { TodoLoadingOverlay } from '../TodoLoadingOverlay';

type Props = {
  todo: TodoRich;
  onTodoDelete?: (todoId: number) => Promise<void>;
  onTodoToggle?: (todoId: number, isCompleted: boolean) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
    isLoading,
  },
  onTodoDelete,
  onTodoToggle,
}) => {
  const hadndleTodoDelete = async () => {
    if (!onTodoDelete) {
      return;
    }

    await onTodoDelete(id);
  };

  const hadndleTodoToggle
    = async (checkEvent: React.ChangeEvent<HTMLInputElement>) => {
      if (!onTodoToggle || checkEvent.target.type !== 'checkbox') {
        return;
      }

      await onTodoToggle(id, checkEvent.target.checked);
    };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={hadndleTodoToggle}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={hadndleTodoDelete}
      >
        ×
      </button>

      {isLoading && <TodoLoadingOverlay />}
    </div>
  );
};
