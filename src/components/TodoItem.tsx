import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  deleteTodos: (todoIds: number[]) => Promise<void>;
  isLoading: boolean;
  processingTodoIds: number[];
  toggleTodos: (todos: Todo[]) => Promise<boolean[]>;
  updateTodos: (todosToUpdate: Todo[]) => Promise<boolean[]>;
  focusInput: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodos,
  isLoading,
  processingTodoIds,
  toggleTodos,
  updateTodos,
  focusInput,
}) => {
  const { id, title, completed } = todo;

  const [editedTitle, setEditedTitle] = useState<string>(title);
  const [isEditing, setIsEditing] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    deleteTodos([id]);
  };

  const handleToggle = () => {
    toggleTodos([todo]);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      await deleteTodos([id]);
      focusInput();

      return;
    }

    if (title === trimmedTitle) {
      setEditedTitle(trimmedTitle);
      setIsEditing(false);
      focusInput();

      return;
    }

    setIsEditing(false);
    setEditedTitle(trimmedTitle);

    const updatedTodo = { ...todo, title: trimmedTitle };
    const [success] = await updateTodos([updatedTodo]);

    if (!success) {
      setIsEditing(true);
    } else {
      focusInput();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveEdit();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
      focusInput();
    }
  };

  const isProcessing = isLoading || processingTodoIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={handleEditChange}
          onKeyUp={handleKeyDown}
          onBlur={handleSaveEdit}
          ref={editInputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            aria-label="Delete todo"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
