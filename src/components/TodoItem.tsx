import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../App';

type Props = {
  todo: Todo;
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  onDelete,
  onUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTemp = todo.id === 0;

  useEffect(() => {
    if (isTodoEditing && selectedPostId === todo.id) {
      setShouldFocus(true);
    }
  }, [isTodoEditing, selectedPostId, todo.id]);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  const handleDeleteTodo = async (id: number) => {
    try {
      setIsLoading?.(true);
      await onDelete(id);
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleStatusComplete = async () => {
    try {
      setIsLoading?.(true);
      await onUpdate({ ...todo, completed: !todo.completed });
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleTodoEditTitle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title.trim()) {
      setIsTodoEditing(false);

      return;
    }

    setIsSubmitting(true);
    setIsLoading?.(true);

    try {
      if (!trimmedTitle) {
        await onDelete(todo.id);
      } else {
        await onUpdate({ ...todo, title: trimmedTitle });
      }

      setIsTodoEditing(false);
    } catch (error) {
      throw new Error(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsLoading?.(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? ' completed' : ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusComplete}
        />
      </label>
      {isTodoEditing && selectedPostId === todo.id ? (
        <form onSubmit={handleTodoEditTitle}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleTodoEditTitle}
            disabled={isLoading}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setIsTodoEditing(false);
                setEditedTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsTodoEditing(true);
              setSelectedPostId(todo.id);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
