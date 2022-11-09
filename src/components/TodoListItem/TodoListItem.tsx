import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  isLoading: boolean
  onRemove?: (todoId: number) => Promise<void>
  toggleTodoStatus: (todoId: number, status: boolean) => Promise<void>
};

export const TodoListItem: React.FC<Props> = React.memo(({
  todo,
  onRemove,
  isLoading,
  toggleTodoStatus,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleStatusToggle = useCallback(() => {
    toggleTodoStatus(id, !completed);
  }, [completed]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={handleStatusToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemoveClick}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
