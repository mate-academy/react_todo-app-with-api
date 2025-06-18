/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type TodoItemProps = {
  todo: Todo;
  isTemp?: boolean;
  onDeleteTodo?: (todoId: number) => Promise<void>;
  onToggleTodo?: (todoId: number, completed: boolean) => Promise<void>;
  isEditing?: boolean;
  editingTitle?: string;
  onStartEdit?: (todoId: number, title: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (todoId: number, title: string) => Promise<void>;
  setEditingTitle?: (title: string) => void;
  processingWithTodos?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTemp,
  onDeleteTodo,
  onToggleTodo,
  isEditing,
  editingTitle,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  setEditingTitle,
  processingWithTodos,
}) => {
  const inputId = `todo-status-${todo.id}`;

  const editInputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputFocusRef.current) {
      editInputFocusRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isTemp && onStartEdit) {
      onStartEdit(todo.id, todo.title);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (onSaveEdit) {
      await onSaveEdit(todo.id, editingTitle!);
    }
  };

  const handleEditKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleEditBlur = async () => {
    if (onSaveEdit) {
      await onSaveEdit(todo.id, editingTitle!);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={inputId}>
        <input
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={processingWithTodos || isEditing}
          onChange={() => {
            onToggleTodo?.(todo.id, !todo.completed);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={e => setEditingTitle?.(e.target.value)}
            ref={editInputFocusRef}
            onKeyUp={handleEditKeyUp}
            onBlur={handleEditBlur}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title.trim()}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodo?.(todo.id)}
          disabled={processingWithTodos}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingWithTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
