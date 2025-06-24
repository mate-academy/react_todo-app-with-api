import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onDelete: (todoId: number, onSuccess?: () => void) => void;
  onToggle: (todoId: number) => void;
  isTemp?: boolean;
  onUpdate: (todoId: number, newTitle: string, onSuccess?: () => void) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDelete,
  onToggle,
  onUpdate,
  isTemp = false,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.title);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading = loadingTodoIds.includes(todo.id);

        const handleSave = () => {
          const trimmedValue = editingValue.trim();

          if (trimmedValue === todo.title.trim()) {
            setEditingId(null);

            return;
          }

          if (!trimmedValue) {
            onDelete(todo.id, () => setEditingId(null));

            return;
          }

          onUpdate(todo.id, trimmedValue, () => setEditingId(null));
        };

        const handleKeyDown = (event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            handleSave();
          }

          if (event.key === 'Escape') {
            setEditingId(null);
          }
        };

        const handleBlur = () => {
          handleSave();
        };

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
              deleting: isLoading,
            })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
              />
            </label>

            {editingId === todo.id ? (
              <input
                data-cy="TodoTitleField"
                className="todo__title-field"
                type="text"
                value={editingValue}
                onChange={e => setEditingValue(e.target.value)}
                autoFocus
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              />
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo)}
              >
                {todo.title}
              </span>
            )}

            {editingId !== todo.id && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
                disabled={isTemp}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
