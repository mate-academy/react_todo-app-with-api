/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Loader } from './Loader';

type TodoItemProps = {
  todo: Todo;
  handleToggle: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoTitle: (id: number, title: string) => void;
  isLoading: boolean;
};

// eslint-disable-next-line react/display-name
export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({
    todo,
    handleToggle,
    handleDeleteTodo,
    handleUpdateTodoTitle,
    isLoading,
  }) => {
    const { id, title, completed } = todo;
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    const todoClassName = useMemo(
      () => classNames('todo', { completed }),
      [completed],
    );

    const handleDoubleClick = () => setIsEditing(true);

    const handleBlur = async () => {
      const newTitleTrimmed = newTitle.trim();

      if (newTitleTrimmed !== title) {
        await handleUpdateTodoTitle(id, newTitleTrimmed);
      }

      if (newTitleTrimmed.length > 0) {
        setIsEditing(false);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleBlur();
      }

      if (event.key === 'Escape') {
        setNewTitle(title);
        setIsEditing(false);
      }
    };

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    return (
      <div
        className={todoClassName}
        data-cy="Todo"
        onDoubleClick={handleDoubleClick}
      >
        <label htmlFor={`todo-${id}`} className="todo__status-label">
          <input
            data-cy="TodoStatus"
            id={`todo-${id}`}
            type="checkbox"
            className="todo__status"
            checked={completed}
            disabled={isLoading}
            onChange={() => handleToggle(id, !completed)}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleDoubleClick}>
            <input
              data-cy="TodoTitleField"
              ref={inputRef}
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
        )}
        {!isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
            disabled={isLoading}
          >
            ×
          </button>
        )}
        <Loader isLoading={isLoading} />
      </div>
    );
  },
);
