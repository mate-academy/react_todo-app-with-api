import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  editTodos: number[];
  onToggle: (id: number, completed: boolean) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  editTodos,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isLoading = editTodos.includes(todo.id);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const completed = event.target.checked;

    await onToggle(todo.id, completed);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = async () => {
    if (newTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle.trim()) {
      handleDelete();

      return;
    }

    try {
      await onUpdate(todo.id, newTitle.trim());
      setIsEditing(false);
    } catch {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      ) : (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          ref={inputRef}
        />
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
