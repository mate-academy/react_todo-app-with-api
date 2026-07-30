/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  onChange: (updTodo: Todo) => Promise<Todo>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>(todo.title);
  const trimTempTitle = tempTitle.trim();

  const handleDoubleClick = (): void => {
    setTempTitle(todo.title);
    setIsEditing(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTempTitle(event.target.value);
  };

  const handleSaveChanges = (): void => {
    if (trimTempTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimTempTitle === '') {
      onDelete(todo.id);

      return;
    }

    onChange({ ...todo, title: trimTempTitle }).then(() => setIsEditing(false));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSaveChanges();
  };

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>): void => {
    event.preventDefault();
    handleSaveChanges();
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChange({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            type="text"
            value={tempTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
