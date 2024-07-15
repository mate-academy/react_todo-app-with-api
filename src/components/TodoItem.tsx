/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { FC, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';
import { upDateTodo } from '../api/todos';
import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  todo: Todo;
  loadingIds: number[];

  handleCompletedTodo: (todo: Todo) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: (message: ErrorMessages) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};
export const TodoItem: FC<Props> = ({
  todo,

  loadingIds,
  handleCompletedTodo,
  setLoadingTodoIds,
  deleteTodo,
  setErrorMessage,
  setLoading,
  updateTodoTitle,
}) => {
  const [showUpdateInput, setShowUpdateInput] = useState(false);

  const [updateTitle, setUpdateTitle] = useState(todo.title);

  const focusUpdateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusUpdateRef.current) {
      focusUpdateRef.current.focus();
    }
  }, [showUpdateInput]);

  const handleNewTitle = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
    todoWillChange: Todo,
  ) => {
    e.preventDefault();

    const updatedTodo = {
      ...todoWillChange,
      title: updateTitle.trim(),
    };

    if (!updatedTodo.title) {
      deleteTodo(updatedTodo.id);
    } else if (updatedTodo.title === todoWillChange.title) {
      setShowUpdateInput(false);

      return;
    } else {
      setLoadingTodoIds(prevId => [...prevId, todo.id]);
      setLoading(true);
      upDateTodo(todo.id, updatedTodo)
        .then(() => {
          updateTodoTitle(updatedTodo.id, updatedTodo.title);
          setLoadingTodoIds(prevId => prevId.filter(prev => prev !== todo.id));
          setShowUpdateInput(false);
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UnableUpdateTodo);
          setLoadingTodoIds(prevId => prevId.filter(prev => prev !== todo.id));
          setShowUpdateInput(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedTodo(todo)}
        />
      </label>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingIds.includes(todo.id) && 'is-active'} `}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {!showUpdateInput ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setShowUpdateInput(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <div
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setShowUpdateInput(false);
            }
          }}
          onBlur={() => setShowUpdateInput(false)}
        >
          <form onSubmit={event => handleNewTitle(event, todo)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={focusUpdateRef}
              value={updateTitle}
              onChange={event => setUpdateTitle(event.target.value)}
              onBlur={event => handleNewTitle(event, todo)}
            />
          </form>
        </div>
      )}
    </div>
  );
};
