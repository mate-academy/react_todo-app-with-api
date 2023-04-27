import React, { useCallback, useState } from 'react';

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

  const [isEditing, setIsEditing] = useState(false);

  const handlerFocus = useCallback((focus: boolean) => {
    setIsEditing(focus);
  }, []);

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => onCompleted(id, completed)}
        />
      </label>

      {isEditing
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
              onDoubleClick={() => setIsEditing(true)}
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
