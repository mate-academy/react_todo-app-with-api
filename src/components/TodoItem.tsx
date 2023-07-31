import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodoFromServer, updateTodoOnServer } from '../api/todos';
import { TodoError } from '../types/TodoError';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  setErrorMessage: (newError: TodoError) => void,
  updateTodo: (updatedTodo: Todo) => void,
  loadingTodos: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  setErrorMessage,
  updateTodo,
  loadingTodos,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const setInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleRemoveClick = () => {
    setIsLoading(true);

    deleteTodoFromServer(todo.id)
      .then(() => deleteTodo(todo.id))
      .catch(() => setErrorMessage(TodoError.Delete))
      .finally(() => setIsLoading(false));
  };

  const handleCheckboxChange = () => {
    setIsLoading(true);

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodoOnServer(updatedTodo)
      .then(todoFromServer => updateTodo(todoFromServer))
      .catch(() => setErrorMessage(TodoError.Update))
      .finally(() => setIsLoading(false));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setInputFocus();
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setIsLoading(true);

    if (!title) {
      deleteTodoFromServer(todo.id)
        .then(() => deleteTodo(todo.id))
        .catch(() => {
          setErrorMessage(TodoError.Delete);
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

    updateTodoOnServer(updatedTodo)
      .then(todoFromServer => updateTodo(todoFromServer))
      .catch(() => {
        setErrorMessage(TodoError.Update);
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
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleEsc}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
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
          'is-active': isLoading || loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
