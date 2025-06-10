/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import {
  handleTodoBlur,
  handleTodoDoubleClick,
  handleTodoKeyDown,
  handleTodoKeyUp,
} from '../utils/helpers';
// import { UPDATE_TODO_ERROR } from '../hooks/constants';

interface TodoItemProps {
  todo: Todo;
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  isLoading: boolean;

  showErrorContainer: (message: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  onDelete,
  onUpdate,
  isLoading,

  showErrorContainer,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const [shouldFocus, setShouldFocus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isTodoEditing && selectedPostId === todo.id) {
      inputRef.current?.focus();
    }
  }, [isTodoEditing, selectedPostId, todo.id]);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  const handleStatusComplete = async () => {
    try {
      setLoading(true);
      await onUpdate({ ...todo, completed: !todo.completed });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title.trim()) {
      setIsTodoEditing(false);

      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      if (!trimmedTitle) {
        await onDelete(todo.id);
      } else {
        await onUpdate({ ...todo, title: trimmedTitle });
      }

      setIsTodoEditing(false);
    } catch (error) {
      setEditedTitle(todo.title);
      showErrorContainer('Unable to update a todo');

      return;
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'todo--loading': isLoading || loading,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusComplete}
          disabled={loading}
        />
      </label>

      {isTodoEditing && selectedPostId === todo.id ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={() =>
              handleTodoBlur(
                isSubmitting,
                editedTitle,
                todo.title,
                handleTitleSubmit,
                setIsTodoEditing,
              )
            }
            onKeyUp={e =>
              handleTodoKeyUp(e, setEditedTitle, todo.title, setIsTodoEditing)
            }
            disabled={loading}
            onKeyDown={e =>
              handleTodoKeyDown(e, isSubmitting, handleTitleSubmit)
            }
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() =>
              handleTodoDoubleClick(
                setIsTodoEditing,
                setSelectedPostId,
                todo.id,
              )
            }
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay disabled', {
          'is-active': isLoading || loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
