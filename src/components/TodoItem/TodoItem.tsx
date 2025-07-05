import React, { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<boolean>;
  isLoading: boolean;
  isTemporary?: boolean;
  onToggle: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  isTemporary,
  onToggle,
  onUpdate,
}) => {
  const { id, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editTitleRef = useRef<HTMLInputElement>(null);

  const handleEditTodo = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      const success = await onDelete(todo.id);

      if (success) {
        setIsEditing(false);
      } else {
        editTitleRef.current?.focus();
      }

      return;
    }

    if (todo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    const success = await onUpdate({ ...todo, title: trimmedTitle });

    if (success) {
      setIsEditing(false);
    } else {
      editTitleRef.current?.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTodo();
    }

    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={id}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo.id)}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
          ref={editTitleRef}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isTemporary,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
