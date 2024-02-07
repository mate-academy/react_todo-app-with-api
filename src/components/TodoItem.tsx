import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: () => void;
  onToggle?: () => void;
  onRename?: (newTitle: string) => Promise<void>;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onDelete = () => {},
    onToggle = () => {},
    onRename = () => Promise.resolve(),
    loading = false,
  },
) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (title.trim() === todo.title) {
      setEditing(false);

      return;
    }

    if (title.trim() === '') {
      onDelete();

      return;
    }

    try {
      await onRename(title);

      setEditing(false);
      console.log('Renamed');
    } catch {
      console.log('Rename failed');
      inputRef.current?.focus()
    }
  }

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>
      
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
                setTitle(todo.title)
              }
            }}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span 
            data-cy="TodoTitle" 
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete()}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className={cn('modal overlay',
            { 'is-active': loading})}>
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </>
      )}
     
    </div>
  );
};
