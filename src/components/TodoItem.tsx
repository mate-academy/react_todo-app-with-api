import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSetEditingId: (id: number | null) => void;
  onEdit: (id: number) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  onToggle,
  onDelete,
  onSetEditingId,
  onEdit,
  editTitle,
  setEditTitle,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    onEdit(todo.id);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      onSetEditingId(null);
    }
  };

  const handleDoubleClick = () => {
    onSetEditingId(todo.id);
    setEditTitle(todo.title);
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        htmlFor={`todo-checkbox-${todo.id}`}
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          id={`todo-checkbox-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />

        <span className="visually-hidden">{''}</span>
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={editInputRef}
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleDoubleClick}>
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={`modal overlay ${isLoading ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
