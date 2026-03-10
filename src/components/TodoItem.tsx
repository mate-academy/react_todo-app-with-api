import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEditStart: (todo: Todo) => void;
  onEditSave: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onEditCancel: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  isEditing,
  editingTitle,
  onToggle,
  onDelete,
  onEditStart,
  onEditSave,
  onEditTitleChange,
  onEditCancel,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEditSave(todo);
    }

    if (e.key === 'Escape') {
      onEditCancel();
    }
  };

  const handleBlur = () => {
    onEditSave(todo);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      <label
        htmlFor={`todo-${todo.id}`}
        className="todo__status-label"
      >
        Toggle
      </label>

      {isEditing ? (
        <input
          ref={editInputRef}
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={e => onEditTitleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEditStart(todo)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          data-cy="TodoDelete"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
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
};
