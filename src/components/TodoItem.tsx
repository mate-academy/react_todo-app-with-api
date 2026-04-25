/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import type { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingTitle: string;
  isTemp?: boolean;
  onDeleteTodo: (todoId: number) => Promise<boolean>;
  onToggleTodo: (todo: Todo) => Promise<void>;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  onEditingTitleChange: (title: string) => void;
  onSubmitEditing: (todo: Todo) => Promise<boolean>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  editingTitle,
  isTemp = false,
  onDeleteTodo,
  onToggleTodo,
  onStartEditing,
  onCancelEditing,
  onEditingTitleChange,
  onSubmitEditing,
}) => {
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const isCommitting = useRef(false);
  const shouldIgnoreBlur = useRef(false);
  const statusFieldId = `todo-status-${todo.id}`;

  useEffect(() => {
    if (!isEditing) {
      isCommitting.current = false;
      shouldIgnoreBlur.current = false;

      return;
    }

    titleFieldRef.current?.focus();
  }, [isEditing]);

  const handleSubmit = async () => {
    if (isCommitting.current || isTemp) {
      return;
    }

    isCommitting.current = true;

    const isCompleted = await onSubmitEditing(todo);

    isCommitting.current = false;

    if (!isCompleted) {
      titleFieldRef.current?.focus();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label" htmlFor={statusFieldId}>
        <input
          id={statusFieldId}
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          disabled={isLoading || isTemp}
          onChange={() => onToggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <input
            ref={titleFieldRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            data-cy="TodoTitleField"
            value={editingTitle}
            onChange={event => onEditingTitleChange(event.target.value)}
            onBlur={() => {
              if (shouldIgnoreBlur.current) {
                shouldIgnoreBlur.current = false;

                return;
              }

              void handleSubmit();
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                shouldIgnoreBlur.current = true;
                onCancelEditing();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => {
              if (!isLoading && !isTemp) {
                onStartEditing(todo);
              }
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading || isTemp}
            onClick={() => {
              void onDeleteTodo(todo.id);
            }}
          >
            &times;
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading || isTemp,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
