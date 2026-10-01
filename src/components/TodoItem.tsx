/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (value: number, valueq: boolean) => void;
  onDelete: (value: number) => Promise<boolean>;
  deletingTodoId: number | null;
  updatingTodoId: number | null;
  listOfUpdatedTodos: number[];
  editingTodoId: number | null;
  onEdit: (value: number | null) => void;
  onEditing: (value: number, value1: string) => Promise<boolean>;
};

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  deletingTodoId,
  updatingTodoId,
  listOfUpdatedTodos,
  editingTodoId,
  onEdit,
  onEditing,
}: Props) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const editting = useRef<HTMLInputElement>(null);
  const handleCancelEdit = () => {
    setEditingTitle(todo.title);
    onEdit(null);
  };

  const isLoading =
    deletingTodoId === todo.id ||
    updatingTodoId === todo.id ||
    listOfUpdatedTodos.includes(todo.id);

  useEffect(() => {
    if (editingTodoId === todo.id) {
      editting.current?.focus();
    }
  }, [editingTodoId, todo.id]);

  const handleFinishEdit = async () => {
    if (editingTitle.trim() === '') {
      const ifEmpty = await onDelete(todo.id);

      if (ifEmpty) {
        onEdit(null);
      }

      return;
    }

    if (editingTitle.trim() === todo.title) {
      onEdit(null);

      return;
    }

    const success = await onEditing(todo.id, editingTitle.trim());

    if (success) {
      onEdit(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
    }

    if (event.key === 'Enter') {
      handleFinishEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={editingTitle}
          autoFocus
          onChange={event => setEditingTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => handleFinishEdit()}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEdit(todo.id)}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background
                      has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
