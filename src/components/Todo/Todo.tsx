/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  isLoading: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onToggle?: (todoId: number, completed: boolean) => void;
  onUpdate?: (
    todoId: number,
    title: string,
  ) => Promise<boolean>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);
  const cancelEditingRef = useRef(false);
  const saveInProgressRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const startEditing = () => {
    if (isLoading) {
      return;
    }

    cancelEditingRef.current = false;
    saveInProgressRef.current = false;

    setEditTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    cancelEditingRef.current = true;
    saveInProgressRef.current = false;

    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const saveEditing = () => {
    if (
      cancelEditingRef.current ||
      saveInProgressRef.current
    ) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      saveInProgressRef.current = true;

      onDelete?.(todo.id).then(success => {
        saveInProgressRef.current = false;

        if (success) {
          setIsEditing(false);
        }
      });

      return;
    }

    saveInProgressRef.current = true;

    onUpdate?.(todo.id, trimmedTitle).then(success => {
      saveInProgressRef.current = false;

      if (success) {
        setIsEditing(false);
      }
    });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    saveEditing();
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleToggle = () => {
    if (isLoading) {
      return;
    }

    onToggle?.(todo.id, !todo.completed);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={event =>
              setEditTitle(event.target.value)
            }
            onBlur={saveEditing}
            onKeyUp={handleKeyUp}
            disabled={isLoading}
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
            onClick={() => onDelete?.(todo.id)}
            disabled={isLoading || !onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isLoading ? 'is-active' : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
