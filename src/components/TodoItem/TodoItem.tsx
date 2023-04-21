import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemoveTodo: (todoId: number) => void,
  loadingTodo: number[],
  onUpdateTodo: (id: number, data: Partial<Todo>) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  loadingTodo,
  onUpdateTodo,
}) => {
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const isLoading = todo.id !== undefined && loadingTodo.includes(todo.id);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleOpenInput = () => {
    setIsEditing(true);
    setQuery(todo.title);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setQuery(newTitle);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      onRemoveTodo(todo.id || 0);
    }

    if (query.trim() !== todo.title) {
      onUpdateTodo(todo.id || 0, { title: query.trim() });
    }

    setIsEditing(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleChangeTitle(event);
    setIsEditing(false);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => onUpdateTodo(todo.id || 0, {
            completed: !todo.completed,
          })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              ref={inputRef}
              value={query}
              onChange={handleChangeTitle}
              onBlur={handleBlur}
              onKeyUp={handleEscape}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleOpenInput}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => todo.id && onRemoveTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
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
