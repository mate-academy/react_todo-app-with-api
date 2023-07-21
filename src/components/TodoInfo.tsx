import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
  onUpdate: (id: number, data: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo, isLoading, onDelete, onToggle, onUpdate,
}) => {
  const { title, completed, id } = todo;
  const [editMode, setEditMode] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleToggleChange = () => {
    onToggle(todo.id);
  };

  const handleDeleteChange = () => {
    onDelete(todo.id);
  };

  const handleDoubleClick = () => {
    setEditMode(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleTitleSubmit = () => {
    if (todoTitle.trim() === '') {
      onDelete(id);
    } else {
      setEditMode(false);
      onUpdate(id, { title: todoTitle });
    }
  };

  const handleTitleCancel = () => {
    setEditMode(false);
    setTodoTitle(title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      handleTitleCancel();
    }
  };

  return (
    <div className={
      classNames('todo', { completed })
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggleChange}
          checked={completed}
        />
      </label>

      {editMode ? (
        <input
          type="text"
          className="todo__title-field"
          value={todoTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {!editMode ? (
        <button
          type="button"
          className="todo__remove"
          onClick={handleDeleteChange}
        >
          ×
        </button>
      ) : null}

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
