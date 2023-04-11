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
  onTodoUpdate?: (todoId: number, updatedData: TodoRichEditable)
  => Promise<void>;
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
  const hadndleTodoDelete = async () => onTodoDelete(id);

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
            onTodoDelete={hadndleTodoDelete}
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
