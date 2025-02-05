/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number, finallyCallback?: () => void) => void;
  loadingTodos: number[];
  handleUpdateTodo: (
    todoId: number,
    updatedData: {},
    finallyCallback?: () => void,
  ) => void;
};

// eslint-disable-next-line react/display-name
export const TodoInfo: React.FC<Props> = React.memo(
  ({ todo, handleDeleteTodo, loadingTodos, handleUpdateTodo }) => {
    const { id, title, completed } = todo;
    const [isInChangeState, setIsInChangeState] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isInChangeState) {
        input.current?.focus();
      }
    });

    const reset = () => {
      setIsInChangeState(false);
    };

    const handleTodoDoubleClick = () => {
      setIsInChangeState(true);
    };

    const updateTodo = () => {
      const normalizeTitle = newTitle.trim();

      if (normalizeTitle === title) {
        setIsInChangeState(false);

        return;
      }

      if (!normalizeTitle) {
        handleDeleteTodo(id, reset);
      } else {
        handleUpdateTodo(id, { title: normalizeTitle }, reset);
      }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      updateTodo();
    };

    const handleInputOnBlur = () => {
      updateTodo();
    };

    const handleInputOnKeyUp = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.code === 'Escape') {
        reset();
        setNewTitle(title);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label" htmlFor={String(id)}>
          <input
            id={String(id)}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => handleUpdateTodo(id, { completed: !completed })}
          />
        </label>

        {isInChangeState ? (
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={input}
              value={newTitle}
              onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnKeyUp}
              onChange={event => setNewTitle(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': loadingTodos.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
