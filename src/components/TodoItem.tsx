import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onStatusToggle?: (todo: Todo) => void;
  onTitleUpdate?: (todo: Todo, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = () => {},
  onStatusToggle,
  onTitleUpdate = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const startEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      try {
        await onDelete(todo.id);
      } catch {
        return;
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onTitleUpdate?.(todo, trimmedTitle);
    } catch {
      return;
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        {/* */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusToggle?.(todo)}
          readOnly
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEditing}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <TodoLoader isActive={isLoading} />
    </div>
  );
};
