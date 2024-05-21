/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TodoProps } from './todo.props';
import { ErrorTypes } from '../error.component/error';
import * as Services from '../../api/todos';

export const TodoComponent: React.FC<TodoProps> = ({
  todo,
  isTemp = false,
  onDeleteTodo,
  onError,
  onTodoChange,
  isExternalLoading,
}) => {
  const [isEditionActive, setIsEditionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(isTemp);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditForm = () => {
    setIsEditionActive(true);
  };

  // const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
  //   setTitle(event.target.value);
  // };

  const handleCheckboxChange = useCallback(() => {
    const newCheckedState = !todo.completed;

    setIsLoading(true);
    Services.updateTodo(todo.id, { completed: newCheckedState })
      .then(() => {
        onTodoChange({ id: todo.id, completed: newCheckedState });
      })
      .catch(() => {
        onError(ErrorTypes.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [onError, todo, onTodoChange]);

  const handleDelete = useCallback(() => {
    setIsLoading(true);
    Services.deleteTodo(todo.id)
      .then(() => {
        onDeleteTodo && onDeleteTodo(todo.id);
      })
      .catch(() => {
        onError(ErrorTypes.UnableToDeleteTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [onDeleteTodo, onError, todo.id]);

  const handleBlur = useCallback(() => {
    const newTitle = inputRef.current?.value.trim() || '';

    if (!newTitle) {
      handleDelete();

      return;
    }

    if (newTitle !== todo.title) {
      setIsLoading(true);
      Services.updateTodo(todo.id, { title: newTitle })
        .then(() => {
          onTodoChange({ id: todo.id, title: newTitle });
          setIsEditionActive(false);
        })
        .catch(() => {
          onError(ErrorTypes.UnableToUpdateTodo);
          inputRef.current?.focus();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsEditionActive(false);
    }

    return;
  }, [handleDelete, onError, todo.id, todo.title, onTodoChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditionActive(false);
      } else if (event.key === 'Enter') {
        handleBlur();
      }
    };

    if (isEditionActive) {
      inputRef.current?.focus();
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditionActive, handleBlur]);

  return (
    <>
      <div
        data-cy="Todo"
        className={todo.completed ? 'todo completed' : 'todo'}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleCheckboxChange}
          />
        </label>
        {isEditionActive ? (
          <form onSubmit={e => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              // value={title}
              onBlur={handleBlur}
              // onChange={handleTitle}
              ref={inputRef}
              defaultValue={todo.title}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleEditForm}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading || isExternalLoading ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

export default TodoComponent;
