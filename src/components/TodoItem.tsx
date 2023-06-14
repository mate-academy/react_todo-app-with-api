import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, title: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  onUpdateTitle,
}) => {
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    onDeleteTodo(id);
  };

  const handleToggleComplete = () => {
    onUpdateTodo(id, !completed);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setOriginalTitle(title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() === '') {
      handleDelete();
    } else if (editedTitle !== originalTitle) {
      setIsLoading(true);
      setShowLoader(true);
      onUpdateTitle(id, editedTitle);
    }

    setIsEditing(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleBlur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(originalTitle);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing
        && inputRef.current
        && !inputRef.current.contains(event.target as Node)
      ) {
        handleTitleBlur();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    if (isLoading) {
      const loaderTimeout = setTimeout(() => {
        setIsLoading(false);
        setShowLoader(false);
      }, 300);

      return () => clearTimeout(loaderTimeout);
    }

    return () => {};
  }, [isLoading]);

  return (
    <div
      key={id}
      className={classNames('todo', { completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleComplete}
        />
      </label>

      <span className="todo__title" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <form className="form" onSubmit={handleFormSubmit}>
            {showLoader && (
              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
            <input
              className="todo__title-field"
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </form>
        ) : (
          title
        )}
      </span>

      <button type="button" className="todo__remove" onClick={handleDelete}>
        ×
      </button>

      {isLoading && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
