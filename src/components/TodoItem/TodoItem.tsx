import React from 'react';
import classNames from 'classnames';

import { TodoLoadingOverlay } from '../TodoLoadingOverlay';
import { TodoEditForm } from '../TodoEditForm';

import { TodoRich } from '../../types/TodoRich';
import { TodoMode } from '../../types/TodoMode';
import { TodoRichEditable } from '../../types/TodoRichEditable';

type Props = {
  todo: TodoRich;
  onTodoDelete?: (todoId: number) => Promise<void>;
  onTodoToggle?: (todoId: number, isCompleted: boolean) => Promise<void>;
  onTodoUpdate?: (todoId: number, updatedData: TodoRichEditable) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
    mode,
  },
  onTodoDelete,
  onTodoToggle,
  onTodoUpdate,
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

  const handleTodoModeUpdate = (newMode: TodoMode) => {
    if (!onTodoUpdate) {
      return;
    }

    onTodoUpdate(id, { mode: newMode });
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

      {mode === TodoMode.Editing
        ? (
          <TodoEditForm
            title={title}
            onTodoModeUpdate={handleTodoModeUpdate}
          />
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => handleTodoModeUpdate(TodoMode.Editing)}
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

      {mode === TodoMode.Loading && (
        <TodoLoadingOverlay />
      )}
    </div>
  );
};
