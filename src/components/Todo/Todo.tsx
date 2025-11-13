import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/todo';
import '../../styles/todo.scss';

type Props = {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  deletingTodoIds: number[];
  onUpdateTodo: (id: number, updatedTodo: Partial<TodoType>) => void;
  updatingTodoIds?: number[];
  editingId: number | null;
  onEditingIdChange: (id: number | null) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletingTodoIds,
  onUpdateTodo,
  updatingTodoIds,
  editingId,
  onEditingIdChange,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingId === todo.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      onEditingIdChange(null);

      return;
    }

    try {
      if (onUpdateTodo) {
        await onUpdateTodo(todo.id, { title: trimmedTitle });
        onEditingIdChange(null);
      } else {
        onEditingIdChange(null);
      }
    } catch (error) {}
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      onEditingIdChange(null);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onUpdateTodo?.(todo.id, { completed: !todo.completed })
          }
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={event => setEditedTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditingIdChange(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
