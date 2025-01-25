/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isSubmitting: boolean;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  onDoubleClickHandler: (todo: Todo) => void;
  setEditingTitle: (title: string) => void;
  editingTodoId: number | null;
  isEditing: boolean;
  handleToggleTodo: (todo: Todo) => void;
  editingTitle: string;
  handleUpdateTodo: () => void;
  handleBlur: () => void;
  isTogglingAll: boolean;
  isDeleting: boolean;
  isTogglingTodo: boolean;
  loadingIds: number[];
  setEditingTodoId: number;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  isSubmitting,
  tempTodo,
  onDoubleClickHandler,
  setEditingTitle,
  editingTitle,
  isEditing,
  editingTodoId,
  handleToggleTodo,
  handleUpdateTodo,
  handleBlur,
  loadingIds,
  setEditingTodoId,
}) => {
  const { id, title, completed } = todo;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && editingTodoId === id) {
      inputRef.current.focus();
    }
  }, [editingTodoId, id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdateTodo(todo.id, event);
    } else if (event.key === 'Escape') {
      setEditingTitle(title);
      setEditingTodoId(null);
      inputRef.current?.blur();
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodo(id)}
        />
      </label>

      {isEditing && editingTodoId === todo.id ? (
        <form onSubmit={event => handleUpdateTodo(todo.id, event)}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onDoubleClickHandler(todo)}
        >
          {title}
        </span>
      )}

      {editingTodoId !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isSubmitting && !tempTodo) || loadingIds.includes(todo.id),
        })}
      >
        <div className="loader" />
        <div className="modal-background has-background-white-ter" />
      </div>
    </div>
  );
};
