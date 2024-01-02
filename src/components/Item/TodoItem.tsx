import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  handleDelete: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  isLoading: boolean;
  handleErrorMessage: (message: string | null) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDelete: handleDeleteTodo,
  handleToggleComplete,
  isLoading,
  handleErrorMessage,
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

        await updateTodo(todo.id, { title: trimmedTitle });

        // eslint-disable-next-line no-param-reassign
        todo.title = trimmedTitle;
      } catch (error) {
        handleErrorMessage('Unable to update a todo');
      } finally {
        setIsEditing(false);
        setIsEditingLoading(false);
      }
    } else {
      setIsEditing(false);
    }
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
