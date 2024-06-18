/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, Dispatch, useRef } from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Errors } from './types/EnumedErrors';

type Props = {
  todo: Todo;
  deleteTodo: (idNumber: number) => Promise<void>;
  isLoading: boolean;
  editTodo: (todo: Todo) => Promise<void>;
  setError: (error: Errors) => void;
  setTempIds: Dispatch<React.SetStateAction<number[]>>;
};

export const ToDoItem = ({
  todo,
  deleteTodo,
  isLoading,
  editTodo,
  setError,
}: Props) => {
  const [edittedTitle, setEdittedTitle] = useState(todo.title);
  const [renamed, setRenamed] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => setRenamed(false), [todo]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmitEdittedTitle = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = edittedTitle.trim();

    if (trimmedTitle === todo.title) {
      setRenamed(false);

      return;
    }

    if (!trimmedTitle) {
      setUpdated(true);
      deleteTodo(todo.id)
        .catch(() => {
          setError(Errors.UnableToDelete);
        })
        .finally(() => {
          setUpdated(false);
        });
    }

    if (updated) {
      return;
    }

    setUpdated(true);

    editTodo({ ...todo, title: trimmedTitle })
      .then(() => {
        setRenamed(false);
      })
      .catch(() => {
        setRenamed(true);
        setError(Errors.UnableToUpdate);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleChangeStatus = () => {
    if (updated) {
      return;
    }

    setUpdated(true);
    editTodo({ ...todo, completed: !todo.completed })
      .catch(() => {
        setError(Errors.UnableToUpdate);
      })
      .finally(() => {
        setUpdated(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>
      {renamed ? (
        <form
          onSubmit={handleSubmitEdittedTitle}
          onKeyUp={(event: React.KeyboardEvent) => {
            if (event.key === 'Escape') {
              setRenamed(false);
            }
          }}
          onBlur={handleSubmitEdittedTitle}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={edittedTitle}
            onChange={event => setEdittedTitle(event.target.value)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setRenamed(true);
              setEdittedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×{' '}
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
