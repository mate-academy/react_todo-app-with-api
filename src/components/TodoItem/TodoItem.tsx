/* eslint-disable jsx-a11y/label-has-associated-control */
import type { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onPatch: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => Promise<void>;
};

export const TodoItem = ({
  todo,
  isLoading,
  onDelete,
  onPatch,
  onRename,
}: Props) => {
  const loaderBackgroundClass = 'modal-background has-background-white-ter';

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  const save = async () => {
    const newTitle = editedTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (newTitle === '') {
      onDelete(todo.id);

      return;
    }

    try {
      await onRename(todo.id, newTitle);
      setIsEditing(false);
    } catch {
      titleInputRef.current?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          onChange={() => onPatch(todo.id, !todo.completed)}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            ref={titleInputRef}
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={save}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
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
              setEditedTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className={loaderBackgroundClass} />
        <div className="loader" />
      </div>
    </div>
  );
};
