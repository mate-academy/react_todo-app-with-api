import React from 'react';
import classNames from 'classnames';

import { TodoLoadingOverlay } from '../TodoLoadingOverlay';
import { TodoEditForm } from '../TodoEditForm';

import { TodoWithMode } from '../../types/TodoWithMode';
import { TodoMode } from '../../types/TodoMode';
import { TodoDataToUpdate } from '../../types/TodoDataToUpdate';

type Props = {
  todo: TodoWithMode;
  onTodoDelete?: (todoId: number) => Promise<void>;
  onTodoUpdate?: (
    todoId: number,
    updatedData: TodoDataToUpdate
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
    mode,
  },
  onTodoDelete = () => {},
  onTodoUpdate = () => {},
}) => {
  const handleTodoDelete = async () => onTodoDelete(id);

  const hadndleTodoToggle = async (
    checkEvent: React.ChangeEvent<HTMLInputElement>,
  ) => onTodoUpdate(id, { completed: checkEvent.target.checked });

  const handleTodoTitleUpdate = async (newTitle: string) => (
    onTodoUpdate(id, { title: newTitle.trim() })
  );

  const handleEditingSkip = async () => (
    onTodoUpdate(id, { mode: TodoMode.None })
  );

  const handleEditingStart = async () => (
    onTodoUpdate(id, { mode: TodoMode.Editing })
  );

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
            onTodoTitleUpdate={handleTodoTitleUpdate}
            onEditingSkip={handleEditingSkip}
            onTodoDelete={handleTodoDelete}
          />
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleEditingStart}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoDelete}
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
