import React, { useState } from 'react';
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
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
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
