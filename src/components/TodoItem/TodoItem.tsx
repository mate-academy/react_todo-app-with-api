import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  handleToggleCompleted: (todoId: number, completed: boolean) => void;
  handleRemoveTodo: (todoId: number) => void;
  handleChangeTitle: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleToggleCompleted,
  handleRemoveTodo,
  handleChangeTitle,
}) => {
  const { title, completed, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setIsEditing(true);

    if (newTitle.trim() === '') {
      await deleteTodo(id);
    }

    if (newTitle !== title) {
      handleChangeTitle(id, newTitle);
    }

    setIsEditing(false);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleCancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => handleToggleCompleted(id, completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleSubmit}
            ref={inputRef}
            onKeyUp={handleCancelEdit}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal', 'overlay', {
          'is-active': todo.isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
