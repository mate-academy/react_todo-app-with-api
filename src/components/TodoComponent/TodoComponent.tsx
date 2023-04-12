import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  onDelete: (id: number) => void
  onUpdateTodo: (id: number, todo: object) => void
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleRenameSubmition = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      onDelete(todo.id);
    } else {
      onUpdateTodo(todo.id, { title: todoTitle });
      setIsEditing(false);
    }
  };

  const handleEditCancelling = () => {
    setIsEditing(false);
    setTodoTitle(todo.title);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEditCancelling();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleRenameSubmition}
          >
            <input
              className="todo__title-field"
              type="text"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              onBlur={handleRenameSubmition}
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
