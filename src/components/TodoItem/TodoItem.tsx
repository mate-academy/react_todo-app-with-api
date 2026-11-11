import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  updateTodo: (todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  deletingIds: number[];
  setErrorMessage: (text: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingIds,
  updateTodo,
  setErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isCancelledRef = useRef(false);

  const handleSave = async () => {
    if (isCancelledRef.current) {
      isCancelledRef.current = false;

      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle.length === 0) {
      deleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      setIsSaving(true);
      await updateTodo(todo.id, { title: trimmedTitle });
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(ErrorTypes.errorUpdateTodo);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setIsUpdating(true);
      await updateTodo(todo.id, { completed: !todo.completed });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }

    if (e.key === 'Escape') {
      isCancelledRef.current = true;
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed === true ? 'completed' : ''}`}
      onDoubleClick={() => {
        isCancelledRef.current = false;
        setIsEditing(true);
        setNewTitle(todo.title);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo status"
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSaving}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingIds.includes(todo.id) || isSaving || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
