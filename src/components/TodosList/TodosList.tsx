import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onUpdate: (todoId: number, status: boolean) => void;
  onDelete: (todoId: number) => void;
  processingId: number[];
};

export const TodosList: React.FC<Props> = React.memo(({
  todos,
  onUpdate,
  onDelete,
  processingId,
}) => {
  return (
    <>
      {todos.map(({ title, completed, id }) => (
        <div
          data-cy="Todo"
          className={cn(
            'todo',
            { completed },
          )}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => onUpdate(id, !completed)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              {
                'is-active': processingId.includes(id),
                //   || deletingIds.includes(id)
                //   || id === updatingTodoId
                //   || changedTodosIds.includes(id),

              },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
});
