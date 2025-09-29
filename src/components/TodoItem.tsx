import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo, TodoId } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: TodoId, data: Partial<Todo>) => void;
  onDelete: (id: TodoId) => void;
  onStartEditing: (id: TodoId, title: string) => void;
  onEditSubmit: (id: TodoId, title: string) => void;
  onEditCancel: () => void;
  isEditing: boolean;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  isChanging: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onStartEditing,
  onEditSubmit,
  onEditCancel,
  isEditing,
  editingTitle,
  setEditingTitle,
  isChanging,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEditBlur = () => {
    if (isEditing) {
      onEditSubmit(todo.id, editingTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEditCancel();
    }
  };

  const handleDoubleClick = () => {
    onStartEditing(todo.id, todo.title);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Toggle todo status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            onEditSubmit(todo.id, editingTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editInputRef}
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={handleEditBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isChanging,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
