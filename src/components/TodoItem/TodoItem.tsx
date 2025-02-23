import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onToggleComplete: (todoId: number, completed: boolean) => void;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  isTemp?: boolean;
  isDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleComplete,
  onDelete,
  onUpdate,
  isTemp,
  isDeleting,
}) => {
  const { id, title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleCheckboxChange = async () => {
    if (isTemp) {
      return;
    }

    setIsLoading(true);
    try {
      await onToggleComplete(id, !completed);
    } catch {
      alert('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewTitle(title);
  };

  const saveChanges = async () => {
    if (newTitle.trim() === '') {
      await onDelete(id);

      return;
    }

    if (newTitle.trim() === title) {
      cancelEditing();

      return;
    }

    setIsLoading(true);

    try {
      await onUpdate({
        ...todo,
        title: newTitle.trim(),
      });
    } catch {
      alert('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await saveChanges();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = async () => {
    if (isEditing) {
      await saveChanges();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={newTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}

      {!isTemp && !isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
        >
          ×
        </button>
      )}

      <Loader isTemp={isTemp || isDeleting || isLoading} />
    </div>
  );
};
