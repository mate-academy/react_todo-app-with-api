/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { TodoContext } from '../context/TodoContext';
import * as apiService from '../api/todos';
import { Error } from '../types/Errors';
import { updateTodo } from '../api/todos';

interface Props {
  items: Todo;
}

export const TodoItem: React.FC<Props> = ({ items }) => {
  const { completed, title, id } = items;
  const {
    setErrorMessage,
    setTodos,
    setChangedTodos,
  } = useContext(TodoContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handlerInputChange = () => {
    setChangedTodos(currentTodos => [...currentTodos, items]);

    updateTodo({ completed: !completed, title, id })
      .then(() => setTodos(currentTodos => currentTodos
        .map(currentTodo => (currentTodo.id === id
          ? ({ ...currentTodo, completed: !completed })
          : currentTodo))))
      .catch(() => setErrorMessage(Error.UPDATE_ERROR))
      .finally(() => setChangedTodos([]));
  };

  const onSubmitChanges = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editTitle.trim()) {
      setChangedTodos(currentTodos => [...currentTodos, items]);

      apiService.deleteTodos(id)
        .then(() => {
          setTodos(currentTodos => currentTodos
            .filter(currentTodo => currentTodo.id !== id));
        })
        .catch(() => setErrorMessage(Error.DELETE_ERROR))
        .finally(() => setChangedTodos([]));
    }

    if (editTitle.trim()) {
      if (editTitle === title) {
        setIsEditing(false);
      } else {
        setChangedTodos(currentTodos => [...currentTodos, items]);

        apiService.updateTodo({ completed, id, title: editTitle })
          .then(() => {
            setTodos(currentTodos => currentTodos
              .map(currentTodo => (currentTodo.id === id
                ? ({ ...currentTodo, title: editTitle.trim() })
                : currentTodo)));
            setIsEditing(false);
          })
          .catch(() => setErrorMessage(Error.UPDATE_ERROR))
          .finally(() => setChangedTodos([]));
      }
    }
  };

  const reset = () => {
    setIsEditing(false);
    setEditTitle(title);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      reset();
    }
  };

  const handlerClick = () => {
    setChangedTodos(currentTodos => [...currentTodos, items]);

    apiService.deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== id));
      })
      .catch(() => setErrorMessage(Error.DELETE_ERROR))
      .finally(() => setChangedTodos([]));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          onChange={handlerInputChange}
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className={classNames('todo__status', { completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmitChanges}>
          <input
            onKeyUp={handleKeyUp}
            ref={titleField}
            onBlur={onSubmitChanges}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditing(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {items.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handlerClick}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <Loader items={items} />
    </div>

  );
};
