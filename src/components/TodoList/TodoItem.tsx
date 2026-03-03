/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import clsx from 'clsx';

type Props = {
  todo: Todo;
  onToggleTodoStatus: (todo: Todo, completed: boolean) => void;
  isLoading: boolean;
  editedTodoId: number | null;
  setEditedTodoId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onEditTodo: (
    todo: Todo,
    data: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleTodoStatus,
  isLoading,
  editedTodoId,
  setEditedTodoId,
  onDelete,
  onEditTodo,
}) => {
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = todo.id === editedTodoId;

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(todo.title);
      inputRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const saveTitle = async () => {
    const title = editedTitle.trim();

    if (!title) {
      onDelete(todo.id);

      return;
    }

    if (title === todo.title) {
      setEditedTodoId(null);

      return;
    }

    try {
      await onEditTodo(todo, { title });
      setEditedTodoId(null);
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleEditTodoTitle = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    saveTitle();
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setEditedTitle(todo.title);
      setEditedTodoId(null);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={clsx('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleTodoStatus(todo, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditTodoTitle}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.currentTarget.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditedTodoId(todo.id)}
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
        className={clsx('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
