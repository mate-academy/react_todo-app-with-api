/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {
  useContext, useEffect, useState,
  FormEvent, KeyboardEvent, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import { updateTodo } from '../api/todos';
import { Error } from '../types/Error';

interface Props {
  todo: Todo;
}

type EditEvent = FormEvent<HTMLFormElement>
| KeyboardEvent<HTMLInputElement> | null;

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setErrorMessage,
    loadingTodo,
    setLoadingTodo,
    handleDeleteTodo,
    handleUpdateTodo,
  } = useContext(TodoContext);

  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const myInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    myInput.current && myInput.current.focus();
  }, [isEditing, myInput]);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewTitle(title);
  };

  const handleEditSubmit = (event: EditEvent = null) => {
    const newTrimmedTitle = newTitle?.trim();

    if (event) {
      event.preventDefault();
    }

    if (!newTrimmedTitle) {
      handleDeleteTodo(todo);

      return;
    }

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    setLoadingTodo(todos => [...todos, todo]);

    updateTodo(todo.id, { title: newTrimmedTitle })
      .then((newTodo: Todo) => {
        setTodos((currentTodos) => currentTodos
          .map((currentTodo) => (currentTodo.id === todo.id
            ? newTodo
            : currentTodo)));
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(Error.Update);
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleEditSubmit();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  const isLoading = loadingTodo.includes(todo);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      {isEditing ? (
        <>
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
        </>
      ) : (
        <>
          <label className="todo__status-label">
            <input
              onChange={() => handleUpdateTodo(todo)}
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
            onClick={() => handleDeleteTodo(todo)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
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
