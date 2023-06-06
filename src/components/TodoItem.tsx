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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    onDeleteTodo(id);
  };

  const handleToggleComplete = () => {
    onUpdateTodo(id, !completed);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() !== '') {
      onUpdateTitle(id, editedTitle);
    }

    setIsEditing(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleBlur();
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
          <form onSubmit={handleFormSubmit}>
            <input
              className="edit__text"
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
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

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
