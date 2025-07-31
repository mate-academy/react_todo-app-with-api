import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: Partial<Todo>) => void;
  isLoading?: boolean;
  showError?: (m: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  isLoading = false,
  showError,
}) => {
  const { completed, title } = todo;

  const [isEditing, setisEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = editedTitle.trim();

    if (trimmed === '') {
      deleteTodo(todo.id);

      return;
    }

    if (trimmed === title) {
      setisEditing(false);

      return;
    }

    try {
      await updateTodo(todo.id, { title: trimmed });
      setisEditing(false);
    } catch {
      showError?.('Unable to update a todo');
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      {/*eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={async () => {
            try {
              await updateTodo(todo.id, { completed: !todo.completed });
            } catch {
              showError?.('Unable to update a todo');
            }
          }}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            value={editedTitle}
            className="todo__title-field"
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setisEditing(false);
                setEditedTitle(title);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setisEditing(true)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          onClick={() => deleteTodo(todo.id)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
