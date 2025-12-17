/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  inputValue: string;
  loadingTodoIds: number[];
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, completed: boolean) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onChange,
  onRemove,
  onUpdate,
  loadingTodoIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editingTitle.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmed) {
      onRemove(todo.id);

      return;
    }

    try {
      const { id, completed } = todo;

      await onUpdate(id, trimmed, completed);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditingTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChange(todo)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          data-cy="TodoDelete"
          className="todo__remove"
          onClick={() => onRemove(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
