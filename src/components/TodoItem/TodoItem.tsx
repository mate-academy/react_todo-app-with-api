import cn from 'classnames';
import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import './TodoItem.scss';

type Props = {
  todo: Todo
  onDeleteTodo?: (id: number) => unknown
  isProcessing?: boolean
  onStatusChange?: (changedTodo: Todo) => unknown
};

export const TodoItem: FC<Props> = memo(({
  todo, onDeleteTodo, isProcessing, onStatusChange,
}) => {
  const { id, title, completed } = todo;

  const handleDeleteClick = () => {
    if (onDeleteTodo) {
      onDeleteTodo(id);
    }
  };

  const handleStatusChange = (changedTodo: Todo) => {
    if (onStatusChange) {
      onStatusChange(changedTodo);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleStatusChange(todo)}
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
