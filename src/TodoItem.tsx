import React, { useRef, useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo | null;
  onDeleted: (todoId: number) => Promise<void> | void;
  loading: boolean;
  onChecked: (todoId: number) => void;
  onUpdated: (todoId: number, newTitle: string) => Promise<void> | void;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
};

export const TodoItem = ({
  todo,
  onChecked,
  onDeleted,
  onUpdated,
  loading = false,
  editingTodoId,
  setEditingTodoId,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo?.title ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId === todo?.id && !isSaving) {
      setNewTodoTitle(todo.title);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [editingTodoId, todo?.id]);

  if (!todo) {
    return null;
  }

  const isEditing = editingTodoId === todo.id;
  const isLoading = loading || isDeleting || isSaving;

  const cancelEditing = () => {
    setNewTodoTitle(todo.title);
    setEditingTodoId(null);
  };

  const saveChanges = async () => {
    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle.length === 0) {
      setIsDeleting(true);
      try {
        const success = await onDeleted(todo.id);

        if (success) {
          setEditingTodoId(null);
        }
      } finally {
        setIsDeleting(false);
      }

      return;
    }

    setIsSaving(true);
    try {
      const success = await onUpdated(todo.id, trimmedTitle);

      if (success) {
        setEditingTodoId(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      cancelEditing();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      saveChanges();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      saveChanges();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleted(todo.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditingTodoId(todo.id);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        'item-enter-done': isEditing,
      })}
      onDoubleClick={handleEdit}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        {/***/}
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChecked(todo.id)}
          disabled={isLoading}
        />
      </label>

      {!isEditing && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveChanges();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
