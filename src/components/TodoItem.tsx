/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
// eslint-disable-next-line object-curly-newline
import React, { useContext, useEffect, useState, FormEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';

interface Props {
  todo: Todo;
}

type EditEvent = FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement> | null;

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage, loadingTodo, loadingAllTodos, setLoadingTodo } = useContext(TodoContext);

  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [error, setError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const myInput = React.createRef<HTMLInputElement>();

  useEffect(() => {
    myInput.current && myInput.current.focus();
  }, [loadingAllTodos, myInput]);

  // let timerId: NodeJS.Timeout;

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsSubmitted(false);
    setIsEditing(false);
    setNewTitle(title);
  };

  const handleHideError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodo(todo);

    deleteTodo(todoId)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== todoId)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoadingTodo(null));
  };

  const handleChangeCheckbox = (todoId: number) => {
    setLoadingTodo(todo);

    updateTodo(todoId, { completed: !completed })
      .then(() => setTodos(prev => prev
        .map(newTodo => (newTodo.id === todoId
          ? ({ ...newTodo, completed: !completed })
          : newTodo))))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        handleHideError();
        setLoadingTodo(null);
      });
  };

  const handleEditSubmit = (event: EditEvent = null) => {
    if (event) {
      event.preventDefault();
    }

    if (isSubmitted) {
      return;
    }

    setIsSubmitted(true);

    if (!newTitle?.trim()) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    setLoadingTodo(todo);

    updateTodo(todo.id, { title: newTitle.trim() })
      .then((newTodo: Todo) => {
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? newTodo : t)));
        setIsEditing(false);
        setError(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setError(true);
      })
      .finally(() => {
        if (error) {
          handleHideError();
        }

        setLoadingTodo(null);
      });
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleEditSubmit();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    isEditing ? (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            onKeyUp={handleKeyUp}
            ref={myInput}
            onBlur={() => handleEditSubmit()}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': loadingTodo === todo || loadingAllTodos },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ) : (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            onChange={() => handleChangeCheckbox(todo.id)}
            data-cy="TodoStatus"
            type="checkbox"
            className={classNames('todo__status', { completed })}
            checked={completed}
          />
        </label>

        <span
          onDoubleClick={handleEditStart}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {todo.title}
        </span>

        <button
          onClick={() => handleDeleteTodo(id)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': loadingTodo === todo || loadingAllTodos },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )
  );
};
