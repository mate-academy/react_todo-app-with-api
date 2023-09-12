import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<number>,
  updateTodo: (updatedTodo: Todo) => Promise<Todo>,
  loadingTodoIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  loadingTodoIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleRemoveClick = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .finally(() => setIsLoading(false));
  };

  const handleToggle = () => {
    setIsLoading(true);

    const toggledTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(toggledTodo)
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setIsLoading(true);

    if (!title) {
      deleteTodo(todo.id)
        .catch(() => {
          setTitle(todo.title);
        })
        .finally(() => setIsLoading(false));

      return;
    }

    if (title === todo.title) {
      setIsLoading(false);

      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title,
    };

    updateTodo(updatedTodo)
      .catch(() => {
        setTitle(todo.title);
      })
      .finally(() => setIsLoading(false));
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleEsc}
            onBlur={handleSubmit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
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
            onClick={handleRemoveClick}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading || loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
