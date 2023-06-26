import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  deleteTodoId: number,
  toggleTodoStatus: (todoId: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo, onDelete, deleteTodoId, toggleTodoStatus, updateTodoTitle,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveChanges = () => {
    const newTitle = query.trim();

    if (newTitle === '') {
      onDelete(todo.id);
    } else if (newTitle !== todo.title) {
      updateTodoTitle(todo.id, newTitle);
    }

    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setQuery(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEditing();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => {
            setIsCompleted(!isCompleted);
            toggleTodoStatus(todo.id);
          }}
        />
      </label>

      <span className="todo__title">
        {isEditing ? (
          <form onSubmit={handleSaveChanges}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              onBlur={handleSaveChanges}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}
      </span>

      <div className={`modal overlay ${(!todo.id || deleteTodoId === todo.id) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
