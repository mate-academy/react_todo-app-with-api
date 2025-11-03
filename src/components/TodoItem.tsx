/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  isEditing: boolean;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  onEditStart: (id: number) => void;
  onEditSave: (id: number, title: string) => void;
  onEditCancel: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  isEditing,
  onDelete,
  onUpdate,
  onEditStart,
  onEditSave,
  onEditCancel,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const handleSubmit = () => {
    if (!editTitle.trim()) {
      onDelete(todo.id);
    } else if (editTitle !== todo.title) {
      onEditSave(todo.id, editTitle);
    } else {
      onEditCancel();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Escape') {
      setEditTitle(todo.title);
      onEditCancel();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleToggle = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const checkId = `todo-checkbox-${todo.id}`;

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        className="todo__status-label"
        htmlFor={checkId}
        aria-label="Toggle todo status"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={checkId}
          checked={todo.completed}
          onChange={handleToggle}
          disabled={loading}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            ref={editFieldRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditStart(todo.id)}
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
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
