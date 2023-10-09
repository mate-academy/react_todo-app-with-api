import React, { useEffect, useRef, useState } from 'react';
import { ErrorType, Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  isLoading: boolean;
  handleErrorMessage: (message: ErrorType | null) => void;
  handleTitleUpdate: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  handleToggleComplete,
  isLoading,
  handleErrorMessage,
  handleTitleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = async () => {
    if (!editedTitle.trim()) {
      handleDeleteTodo(todo);
    } else if (editedTitle !== todo.title) {
      try {
        setIsEditingLoading(true);
        const trimmedTitle = editedTitle.trim();

        handleTitleUpdate(todo.id, trimmedTitle);
      } catch (error) {
        handleErrorMessage(ErrorType.UnableToUpdateTodo);

        return;
      }
    }

    setIsEditing(false);
    setIsEditingLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggleComplete(todo);
          }}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleBlur} onBlur={handleBlur}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && !isLoading && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo)}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isLoading || isEditingLoading ? 'is-active' : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
