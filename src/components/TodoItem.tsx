import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  onToggle: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete = () => {},
  onToggle,
  onUpdate = () => Promise.resolve(),
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(todo.title);

  const editInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const savedChanges = () => {
    const trimTitle = editedTitle.trim();

    if (trimTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimTitle) {
      onDelete(todo.id);

      return;
    }

    onUpdate({ ...todo, title: trimTitle })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        editInputRef.current?.focus();
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savedChanges();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text "
            className="todo__title-field"
            checked={todo.completed}
            ref={editInputRef}
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={savedChanges}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            setEditedTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
