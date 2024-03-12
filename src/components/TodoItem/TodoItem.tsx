import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as postService from '../../api/todos';

import { Todo } from '../../types/Todo';
import { useTodos } from '../../Store';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    handleChangeStatus,
    isLoading,
    deleteTodo,
    currentTodoId,
    setErrorMessage,
    clearError,
  } = useTodos();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [submittingState, setSubmittingState] = useState<{
    [key: string]: boolean;
  }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const todoId = todo.id;

    if (event.key === 'Enter') {
      setSubmittingState(prevState => ({
        ...prevState,
        [todoId]: true,
      }));

      if (!editedTitle.trim()) {
        deleteTodo(todoId);
      } else {
        setIsEditing(false);
      }

      postService
        .updateTodo({
          ...todo,
          title: editedTitle,
        })
        .then(updatedTodo => {
          setEditedTitle(updatedTodo.title);
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UnableToUpdateaTodo);
          clearError();
        })
        .finally(() => {
          setSubmittingState(prevState => ({
            ...prevState,
            [todoId]: false,
          }));
        });
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (!editedTitle.trim()) {
      deleteTodo(todo.id);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeStatus(todo.id)}
        />
      </label>

      {!isEditing && (
        <>
          <label
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editedTitle}
          </label>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <input
          ref={inputRef}
          className="todo__title"
          value={editedTitle}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      )}

      {submittingState[todo.id] && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      {isLoading && currentTodoId === todo.id && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
