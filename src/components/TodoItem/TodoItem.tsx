import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import '../../styles/transitions.scss';

interface Props {
  todo: Todo,
  removeTodo: (todoId: number) => void;
  loadingTodo: number[];
  updateTodo: (id: number, data: Partial<Todo>) => void
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
  updateTodo,
}) => {
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const isLoading = todo.id && loadingTodo.includes(todo.id);
  const input = useRef<HTMLInputElement>(null);

  const handleOpenTodo = () => {
    setIsEditing(true);
    setQuery(todo.title);
  };

  const handleChangeTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedTitle = event.target.value;

    setQuery(changedTitle);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      removeTodo(todo.id);
    }

    if (query.trim() !== todo.title) {
      updateTodo(todo.id, { title: query.trim() });
    }

    setIsEditing(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleChangeTodo(event);
    setIsEditing(false);
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  };

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo(todo.id, {
            completed: !todo.completed,
          })}
        />
      </label>
      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              ref={input}
              onChange={handleChangeTodo}
              value={query}
              onBlur={handleBlur}
              onKeyUp={handleEsc}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleOpenTodo}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => todo.id && removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay',
        { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
