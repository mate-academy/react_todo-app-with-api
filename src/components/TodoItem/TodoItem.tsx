// File: src/components/TodoItem/TodoItem.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../api/todos';

type Props = {
  todo: Todo;
  loading?: boolean;
  disableActions?: boolean;
  onToggle: (todo: Todo) => void;
  onRename: (
    todo: Todo,
    title: string,
    done?: (success: boolean) => void,
  ) => void;
  onDelete: (todo: Todo) => void;
  setIsEditing?: (editing: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading = false,
  disableActions = false,
  onToggle,
  onRename,
  onDelete,
  setIsEditing,
}) => {
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);
  const showControls = useMemo(() => !localIsEditing, [localIsEditing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (localIsEditing) {
      setTimeout(() => {
        editRef.current?.focus();
        editRef.current?.select();
      }, 0);
    }
  }, [localIsEditing]);

  const startEdit = () => {
    if (loading || disableActions || todo.id === 0) {
      return;
    }

    setTitle(todo.title);
    setLocalIsEditing(true);
    if (typeof setIsEditing === 'function') {
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setLocalIsEditing(false);
    setTitle(todo.title);
    if (typeof setIsEditing === 'function') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      // If title is empty, delete the todo
      // Only close the form if delete succeeds (simulate async)
      onDelete(todo);
      // Do not close the form here; let parent close on success
      // If you want to handle async, you can pass a callback to onDelete
    } else if (trimmedTitle !== todo.title) {
      // If title changed, save
      onRename(todo, trimmedTitle, (success: boolean) => {
        if (success) {
          setLocalIsEditing(false);
          if (typeof setIsEditing === 'function') {
            setIsEditing(false);
          }
        }
        // If failed, keep edit form open
      });
    } else {
      // If unchanged, cancel
      setLocalIsEditing(false);
      if (typeof setIsEditing === 'function') {
        setIsEditing(false);
      }
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <li
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={startEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={loading || disableActions || todo.id === 0}
          onChange={() => onToggle(todo)}
        />
        <span className="visually-hidden">Mark todo as complete</span>
      </label>

      {showControls ? (
        <>
          <span className="todo__title" data-cy="TodoTitle">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            disabled={loading || disableActions || todo.id === 0}
            onClick={() => onDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref={editRef}
            className="todo__title-field"
            data-cy="TodoTitleField"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={onKeyUp}
            disabled={loading}
          />
        </form>
      )}

      {/* Loader overlay */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
