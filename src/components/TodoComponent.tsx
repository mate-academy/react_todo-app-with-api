import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  changeStatus: (todo: Todo) => void;
  onRename: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  changeStatus,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editField = useRef<HTMLInputElement>(null);
  const isSaving = useRef(false);
  const editingActive = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editField.current?.focus();
    }
  }, [isEditing]);

  const stopEditing = () => {
    editingActive.current = false;
    setIsEditing(false);
  };

  const startEditing = () => {
    if (isLoading || isSaving.current) {
      return;
    }

    setNewTitle(todo.title);
    editingActive.current = true;
    setIsEditing(true);
  };

  const saveTitle = async () => {
    if (!editingActive.current || isSaving.current) {
      return;
    }

    const preparedTitle = newTitle.trim();

    if (preparedTitle === todo.title) {
      stopEditing();

      return;
    }

    isSaving.current = true;

    try {
      await onRename(todo.id, preparedTitle);
      stopEditing();
    } catch {
      editField.current?.focus();
    } finally {
      isSaving.current = false;
    }
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && !isSaving.current) {
      stopEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-input-${todo.id}`}
        aria-label={todo.title}
      >
        <input
          id={`todo-input-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => changeStatus(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={editField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            aria-label="Task Name"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            readOnly={isLoading}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => void saveTitle()}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
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
