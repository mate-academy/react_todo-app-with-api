/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
  handleStatusChange?: (todo: Todo) => void
  updatingTodoId?: number | null
  updatingTodoIds?: number[]
};
export const TodoInfo:React.FC<Props>
  = ({
    onDelete,
    todo,
    isLoading,
    handleStatusChange,
    updatingTodoId,
    updatingTodoIds,
  }) => {
    const [isEditing] = useState(false);

    console.log('rendering todo');
    const isLoaderActive = todo.id === 0
      || (isLoading && todo.completed)
      || updatingTodoId === todo.id
      || updatingTodoIds?.includes(todo.id);

    return (
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
              if (handleStatusChange) {
                handleStatusChange(todo);
              }
            }}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={todo.title}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                if (onDelete) {
                  onDelete(todo.id);
                }
              }}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoaderActive,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  };
