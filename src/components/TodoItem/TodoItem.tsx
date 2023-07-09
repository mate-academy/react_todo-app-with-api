import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodos: number[];
  handleRemoveTodo: (id: number) => void;
  handleToggleTodoStatus: (todo: Todo) => void;
  handleUpdateTodoTitle: (todo: Todo, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodos,
  handleRemoveTodo,
  handleToggleTodoStatus,
  handleUpdateTodoTitle,
}) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    if (newTitle.trim() === '') {
      handleRemoveTodo(id);
    } else if (newTitle !== title) {
      handleUpdateTodoTitle(todo, newTitle);
    }

    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEditing();
    } else if (event.key === 'Enter') {
      handleSaveChanges();
    }
  };

  const isLoading = loadingTodos.includes(id);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodoStatus(todo)}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          value={newTitle}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveChanges}
          ref={todoInputRef}
        />
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleStartEditing}>
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
