import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  deleteTodoId: number,
  onUpdateTodoTitle: (id: number, newTitle: string) => void;
  onToggleTodo: (todoId: number) => void,
  isDisabled: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  deleteTodoId,
  onUpdateTodoTitle,
  onToggleTodo,
  isDisabled,
}) => {
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
      onUpdateTodoTitle(todo.id, newTitle);
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
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {isDisabled ? (
        <Loader />
      ) : (
        <>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
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

          <div className={cn('modal overlay', {
            'is-active': !todo.id || deleteTodoId === todo.id,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
