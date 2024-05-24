/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import * as todosService from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: string) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  setTodos,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggleComplete = (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    todosService
      .updateTodo({
        id,
        userId: todosService.USER_ID,
        title,
        completed: !completed,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to update a todo`);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== todoId),
        );
      });
  };

  function removeTodo(todoId: number) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== todoId),
        );
      });
  }

  function updateTodo(newTitle: string) {
    if (newTitle.trim() === '') {
      removeTodo(id);

      return;
    }

    if (newTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    setErrorMessage('');

    setLoadingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    return todosService
      .updateTodo({
        id,
        userId: todosService.USER_ID,
        title: newTitle.trim(),
        completed,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(`Unable to update a todo`);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== id),
        );
      });
  }

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleInputBlur = () => {
    updateTodo(editedTitle);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updateTodo(editedTitle);
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo(editedTitle);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleComplete(id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
