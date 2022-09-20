/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  handleUpdateTodo: (todoId: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number;
  toggleLoader: boolean;
}

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    handleDeleteTodo,
    handleUpdateTodo,
    isLoading,
    selectedId,
    toggleLoader,
  } = props;

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleTitleChange = () => {
    setIsDoubleClicked(false);

    if (updatedTitle === '') {
      handleDeleteTodo(todo.id);
    }

    handleUpdateTodo(todo.id, { title: updatedTitle });
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo',
          { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {
              handleUpdateTodo(todo.id, { completed: !todo.completed });
            }}
          />
        </label>

        {isDoubleClicked
          ? (
            <form onSubmit={(event) => {
              event.preventDefault();
              handleTitleChange();
            }}
            >
              <input
                data-cy="TodoTitleField"
                value={updatedTitle}
                type="text"
                ref={newTodoField}
                placeholder="Empty todo will be deleted"
                className="todo__title-field"
                onChange={event => setUpdatedTitle(event.target.value)}
                onBlur={(event) => {
                  event.preventDefault();
                  handleTitleChange();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setIsDoubleClicked(false);
                  }
                }}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setIsDoubleClicked(true);
                  setUpdatedTitle(todo.title);
                }}
                onBlur={() => setIsDoubleClicked(false)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => {
                  handleDeleteTodo(todo.id);
                }}
              >
                ×
              </button>

              {
                selectedId === todo.id && (
                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay',
                      { 'is-active': isLoading })}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                )
              }

            </>
          )}

        {toggleLoader && (
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay',
              { 'is-active': isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
