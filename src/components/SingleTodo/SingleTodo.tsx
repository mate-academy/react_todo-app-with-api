import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo?: (todoId: number) => void;
  processingTodoIds: number | number[] | null;
  onUpdateTodo?: (updatedTodo: Todo) => void;
}

export const SingleTodo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  processingTodoIds,
  onUpdateTodo,
}) => {
  const {
    title, id, completed, userId,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const isProcessing = Array.isArray(processingTodoIds)
    ? processingTodoIds.includes(id)
    : false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onToggle = () => {
    if (onUpdateTodo) {
      onUpdateTodo({
        title,
        id,
        userId,
        completed: !completed,
      });
    }
  };

  const onSubmit = async () => {
    if (!newTitle) {
      if (onDeleteTodo) {
        onDeleteTodo(id);

        return;
      }
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    if (onUpdateTodo) {
      await onUpdateTodo({
        ...todo,
        title: newTitle.trim(),
      });
    }

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!onDeleteTodo) {
      return;
    }

    onDeleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      key={id}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={onSubmit}
          onBlur={onSubmit}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
