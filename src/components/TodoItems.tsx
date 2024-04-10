import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';
import { useTodosContext } from '../context/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { processingIds, setTodos, handleError, handleDeleteTodo } =
    useTodosContext();

  const [queryEditing, setQueryEditing] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const loaderIsActive =
    processingIds.includes(todo.id) || todo.id === 0 || isLoading;

  const inputTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputTodoRef.current) {
      inputTodoRef.current?.focus();
    }
  }, [isEditing]);

  const updateTodoCompleteValue = (itemID: number) => {
    setIsLoading(true);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(itemID, newTodo)
      .then(todoValue => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === todo.id ? todoValue : currentTodo,
          ),
        );
      })
      .catch(() => {
        handleError(ErrorMessages.UpdateTodo);
      })
      .finally(() => {
        inputTodoRef.current?.focus();
        setIsLoading(false);
      });
  };

  const saveInputValue = () => {
    const trimedQueryEditing = queryEditing.trim();

    if (trimedQueryEditing === todo.title) {
      setIsLoading(false);
      setIsEditing(false);
    }

    if (trimedQueryEditing) {
      const newTodo = {
        ...todo,
        title: trimedQueryEditing,
      };

      updateTodo(todo.id, newTodo)
        .then(todoValue => {
          setTodos(prevTodos =>
            prevTodos.map(currentTodo =>
              currentTodo.id === todo.id ? todoValue : currentTodo,
            ),
          );
          setIsEditing(false);
          setQueryEditing(trimedQueryEditing);
        })
        .catch(() => {
          handleError(ErrorMessages.UpdateTodo);
        })
        .finally(() => {
          inputTodoRef.current?.focus();
          setIsLoading(false);
        });
    }

    if (!trimedQueryEditing) {
      handleDeleteTodo(todo.id);
    }
  };

  const handleClickKeybord = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      inputTodoRef.current?.focus();
      setIsEditing(false);
      setQueryEditing(todo.title);
    }

    if (event.key === 'Enter') {
      setIsLoading(true);
      saveInputValue();
    }
  };

  const handleQueryEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryEditing(event.target.value);
  };

  const handleBlurInput = () => {
    setIsLoading(true);
    saveInputValue();
    setIsEditing(false);
  };

  const handleClickOnRemoveButton = () => {
    handleDeleteTodo(todo.id);
    setIsLoading(true);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="Todo status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodoCompleteValue(todo.id)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            ref={inputTodoRef}
            onBlur={handleBlurInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={queryEditing}
            onKeyUp={handleClickKeybord}
            onChange={handleQueryEditChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            onDoubleClick={() => setIsEditing(!isEditing)}
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleClickOnRemoveButton}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loaderIsActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
