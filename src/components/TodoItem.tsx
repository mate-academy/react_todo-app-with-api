import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

interface TodoItemProps {
  todo: Todo;
  deletingTodoId: number | null;
  onDeleteTodo: (id: number) => void;
  isAddingTodo?: boolean;
  onUpdateStatus: (id: number, completed: boolean) => void;
  isUpdating?: boolean;
  onUpdateTitle: (id: number, newTitle: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deletingTodoId,
  onDeleteTodo,
  isAddingTodo,
  onUpdateStatus,
  isUpdating,
  onUpdateTitle,
  setError,
}) => {
  const { id, title, completed } = todo;
  const isDeleting = id === deletingTodoId;


  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(title);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };


const handleSave = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (newTitle === title) {
      setIsEditing(false);
      setError(null);
      return;
    }

    if (newTitle.trim() === '' || newTitle === title) {
      onDeleteTodo(id);
      setError(ErrorType.empty_changed_title);
      return;
    }

    try {
      await onUpdateTitle(id, newTitle.trim());
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(ErrorType.update_todo);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {

      await handleSave();
    } else if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
      setError(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdateStatus(id, !completed)}
          disabled={isUpdating}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={newTitle}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isAddingTodo || isUpdating
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
