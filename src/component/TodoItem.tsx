import React, { RefObject, useState } from 'react';
import classNames from 'classnames';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
  loadingTodoId: number[];
  handleUpdate: (updatedTodo: Todo) => void;
  isEditing: boolean;
  setEditTodoId: (id: number | null) => void;
  inputRef: RefObject<HTMLInputElement>;
  isProcessingTodos: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  toggleTodo,
  handleDelete,
  loadingTodoId,
  handleUpdate,
  isEditing,
  setEditTodoId,
  isProcessingTodos,
}) => {
  const isLoading = loadingTodoId.includes(id) || isProcessingTodos;
  const [editedTitle, setEditedTitle] = useState(title);

  const saveUpdateTitle = () => {
    const trimedTitle = editedTitle.trim();

    if (!trimedTitle) {
      handleDelete(id);
    } else {
      handleUpdate({ id, title: trimedTitle, completed, userId: 0 });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editedTitle.trim() !== title) {
        saveUpdateTitle();
      } else {
        setEditTodoId(null);
      }
    } else if (event.key === 'Escape') {
      setEditTodoId(null);
      setEditedTitle(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(id)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__edit-input"
          value={editedTitle}
          placeholder="Empty todo will be deleted"
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={saveUpdateTitle}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditTodoId(id)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading}
          onClick={() => handleDelete(id)}
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
        {isLoading && <div className="loader" />}
      </div>
    </div>
  );
};
