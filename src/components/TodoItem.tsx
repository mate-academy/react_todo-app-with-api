import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (todoId: number) => void;
  isUpdating: boolean;
  onToggle: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo, newTitle: string, onFinish: () => void) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  isDeleting,
  onDelete,
  isUpdating,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  const showLoader = isLoading || isDeleting || isUpdating;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleFinishEdit = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdateTitle(todo, editedTitle, handleFinishEdit);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        handleSave();
        break;
      case 'Escape':
        handleCancel();
        break;
      default:
        break;
    }
  };

  const handleStartEdit = () => {
    if (!showLoader) {
      setIsEditing(true);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-status-${todo.id}`}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`}
          disabled={showLoader || isEditing}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          ref={editInputRef}
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={event => setEditedTitle(event.target.value)}
          onBlur={handleSave}
          onKeyUp={handleKeyDown}
          disabled={showLoader}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={showLoader}
          >
            x
          </button>
        </>
      )}

      <Loader showLoader={showLoader} />
    </div>
  );
};
