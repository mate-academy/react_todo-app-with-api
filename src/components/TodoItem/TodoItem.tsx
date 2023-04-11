import React from 'react';
import classNames from 'classnames';
import { TodoRich } from '../../types/TodoRich';
import { TodoLoadingOverlay } from '../TodoLoadingOverlay';
import { TodoEditForm } from '../TodoEditForm';

type Props = {
  todo: TodoRich;
  onTodoDelete?: (todoId: number) => Promise<void>;
  onTodoToggle?: (todoId: number, isCompleted: boolean) => Promise<void>;
  onTodoEditingStateChange?: (todoId: number, IsEditing: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
    isLoading,
    isEditing,
  },
  onTodoDelete,
  onTodoToggle,
  onTodoEditingStateChange,
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

  const handleTodoEditingStateChange = (newState: boolean) => {
    if (!onTodoEditingStateChange) {
      return;
    }

    onTodoEditingStateChange(id, newState);
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

      {isEditing
        ? (
          <TodoEditForm
            title={title}
            onTodoEditingStateChange={handleTodoEditingStateChange}
          />
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => handleTodoEditingStateChange(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={hadndleTodoDelete}
            >
              ×
            </button>
          </>
        )}

      {isLoading && <TodoLoadingOverlay />}
    </div>
  );
};
