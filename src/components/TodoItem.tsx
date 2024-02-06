/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {
  useContext, useEffect, useState,
  FormEvent, KeyboardEvent, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';
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
  } = useContext(TodoContext);

  const { id, title, completed } = todo;
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

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodo(todo);

    deleteTodo(todoId)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== todoId)))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setLoadingTodo(null));
  };

  const handleChangeCheckbox = (todoId: number) => {
    setLoadingTodo(todo);

    updateTodo(todoId, { completed: !completed })
      .then(() => setTodos(prev => prev
        .map(newTodo => (newTodo.id === todoId
          ? ({ ...newTodo, completed: !completed })
          : newTodo))))
      .catch(() => setErrorMessage(Error.Update))
      .finally(() => {
        setLoadingTodo(null);
      });
  };

  const handleEditSubmit = (event: EditEvent = null) => {
    const newTrimmedTitle = newTitle?.trim();

    if (event) {
      event.preventDefault();
    }

    if (!newTrimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    setLoadingTodo(todo);

    updateTodo(todo.id, { title: newTrimmedTitle })
      .then((newTodo: Todo) => {
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? newTodo : t)));
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(Error.Update);
      })
      .finally(() => {
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
            { 'is-active': loadingTodo === todo },
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
            { 'is-active': loadingTodo === todo },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )
  );
};
