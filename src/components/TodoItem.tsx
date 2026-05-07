/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isProcessing: boolean;
  onToggle: (todo: Todo) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessing,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEdititng] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  const handleRename = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEdititng(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    onUpdate(todo.id, trimmedTitle).then(() => {
      setIsEdititng(false);
    });
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdititng(true)}
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
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleRename();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setNewTitle(todo.title);
                setIsEdititng(false);
              }
            }}
            ref={editInputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
