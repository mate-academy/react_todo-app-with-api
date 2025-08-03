/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
  updatingTodoIds: number[];
  onDelete: (todoId: number) => void;
  disabled: boolean;
  onRename: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  isLoading,
  updatingTodoIds,
  onDelete,
  onRename,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [wasEscapePressed, setWasEscapePressed] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateTodoTitle = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      await onDelete(todo.id);

      return;
    }

    try {
      await onRename(todo.id, trimmedTitle);
      setIsEditing(false);
    } catch {
      // no operation - error already handled inside onRename
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateTodoTitle();
  };

  const handleBlur = async () => {
    if (wasEscapePressed) {
      setWasEscapePressed(false);

      return;
    }

    await updateTodoTitle();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setWasEscapePressed(true);
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setWasEscapePressed(false);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      )}

      <Loader todoId={todo.id} updatingTodoIds={updatingTodoIds} />
    </div>
  );
};
