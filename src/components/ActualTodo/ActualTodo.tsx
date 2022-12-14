import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => void,
  deletedTodoIds: number[],
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>,) => void,
}

export const ActualTodo: React.FC<Props> = ({
  todo,
  onDelete,
  deletedTodoIds,
  onUpdate,
}) => {
  const { completed, title, id } = todo;
  const isLoaderActive = id === 0 || deletedTodoIds.includes(id);
  // const isChecked = true;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: completed === true },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => onUpdate(id, { completed: !completed })}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoaderActive },
        )}
      >
        <div className="
          modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
