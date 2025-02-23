import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingTodo: boolean;
  onUpdateTodo: (updatedTodo: Todo) => void;
  updateToggle: (toggleTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoadingTodo,
  onUpdateTodo,
  updateToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const updatedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && updatedInput.current) {
      updatedInput.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => setIsEditing(false), [todo]);

  const { title, completed } = todo;
  const id = uuidv4();

  const handleSubmit = () => {
    const correctTitle = updatedTitle.trim();

    if (correctTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!correctTitle) {
      onDelete(todo.id);

      return;
    }

    setUpdatedTitle(correctTitle);

    onUpdateTodo({ ...todo, title: correctTitle });
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleButton = (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
    switch (keyEvent.key) {
      case 'Enter':
        keyEvent.preventDefault();
        handleSubmit();
        break;
      case 'Escape':
        setUpdatedTitle(todo.title);
        setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  return (
    <div
      id={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            ref={updatedInput}
            onBlur={handleBlur}
            onKeyDown={handleButton}
            onChange={handleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {updatedTitle}
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
        className={cn('modal overlay', { 'is-active': isLoadingTodo })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
