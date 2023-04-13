import React, { useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  todo: Todo,
  isLoading?: boolean,
  onDelete?: (todoId: number) => void,
  onCompleted?: (todoId: number, completed: boolean) => void,
  onChangeTitle?: (title: string, todoId: number) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = true,
  onDelete,
  onCompleted = () => {},
  onChangeTitle = () => {},
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isEdditing, setIsEdditing] = useState(false);

  const handlerFocus = (focus: boolean) => {
    setIsEdditing(focus);
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => onCompleted(id, completed)}
        />
      </label>

      {isEdditing
        ? (
          <TodoForm
            todoId={id}
            currentTitle={title}
            onUnfocus={handlerFocus}
            onSubmit={onChangeTitle}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete?.(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
