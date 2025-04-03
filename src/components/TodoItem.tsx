/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { UpdateTodoForm } from './UpdateTodoForm/UpdateTodoForm';

interface Props {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = memo(
  ({ todo, onDelete, onUpdateTodo }) => {
    const { completed, title, loading } = todo;

    const [isUpdate, setIsUpdate] = useState(false);
    const handleOnDeleteTodo = () => {
      onDelete(todo.id);
    };

    return (
      <div
        onDoubleClick={() => setIsUpdate(true)}
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() =>
              onUpdateTodo({ ...todo, completed: !todo.completed })
            }
            checked={completed}
          />
        </label>

        {isUpdate ? (
          <UpdateTodoForm
            updateTodo={todo}
            setIsUpdate={setIsUpdate}
            onUpdateTodo={onUpdateTodo}
            onDelete={onDelete}
          />
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleOnDeleteTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': loading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
