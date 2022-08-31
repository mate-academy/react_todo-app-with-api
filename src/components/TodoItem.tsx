/* eslint-disable @typescript-eslint/no-explicit-any */

import classNames from 'classnames';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (n: number) => void,
  changeTodo: (id: number, data: any) => void,
  loadingTodosId: number[],
};

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo,
  changeTodo,
  loadingTodosId,
}) => {
  const { title, id, completed } = todo;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleSubmitNewTodo = () => {
    if (!newTodoTitle) {
      removeTodo(id);
    }

    if (newTodoTitle === title) {
      setIsDoubleClicked(false);

      return;
    }

    changeTodo(id, { title: newTodoTitle });

    setIsDoubleClicked(false);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => changeTodo(id, { completed: !completed })}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitNewTodo();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={newTodoField}
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(e) => {
                setNewTodoTitle(e.target.value);
              }}
              onBlur={() => handleSubmitNewTodo()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsDoubleClicked(false);
                  setNewTodoTitle(title);
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
              onDoubleClick={() => setIsDoubleClicked(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodosId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
