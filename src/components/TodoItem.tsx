import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  updateTodo?: (todo: Todo, newTodo: Todo) => Promise<void>;
  setErrorMessage?: (error: string) => void;
  onDelete?: (todoId: number) => Promise<void>;
  onChecked?: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  updateTodo,
  setErrorMessage,
  onDelete,
  onChecked,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTodoEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setEditTitle(event.target.value);
  };

  const handleEditTodo = (t: Todo) => {
    const normalizedTitle = editTitle.trim();

    if (todo.title === normalizedTitle) {
      setIsTodoEditing(false);

      return;
    }

    if (normalizedTitle === '') {
      onDelete?.(todo.id)
        .then(() => {
          setIsTodoEditing(false);
        })
        .catch(() => {});

      return;
    }

    updateTodo?.(t, {
      ...t,
      title: normalizedTitle,
    })?.then(() => {
      setIsTodoEditing(false);
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    try {
      handleEditTodo(todo);
    } catch (error) {
      setErrorMessage?.(ErrorMessage.UPDATE_TODO);
    }
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
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo status"
          onChange={() => onChecked?.(todo)}
        />
      </label>

      {!isTodoEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
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
