import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isProcessing: boolean;
  isEditing: boolean;
  editingTitle: string;
  isTemporary?: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isProcessing,
  isEditing,
  editingTitle,
  isTemporary = false,
  onToggle,
  onDelete,
  onStartEditing,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      savingRef.current = false;
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;
    onSaveEdit(todo);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }

    if (event.key === 'Escape') {
      savingRef.current = true;
      onCancelEdit();
    }
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      <div className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          aria-label={`Mark ${todo.title} as completed`}
          checked={todo.completed}
          disabled={isProcessing || isTemporary}
          onChange={() => onToggle(todo)}
          data-cy="TodoStatus"
        />
      </div>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={event => onEditTitleChange(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            data-cy="TodoTitleField"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => onStartEditing(todo)}
          >
            {todo.title}
          </span>

          {!isTemporary && (
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
              disabled={isProcessing}
              data-cy="TodoDelete"
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        className={`todo__loader ${
          isProcessing || isTemporary ? 'is-active' : 'hidden'
        }`}
        data-cy="TodoLoader"
      />
    </div>
  );
};
