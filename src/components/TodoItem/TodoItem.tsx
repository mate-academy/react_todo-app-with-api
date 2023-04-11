import { FC } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  loadingTodosId: number[],
  onUpdate: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    loadingTodosId,
    onUpdate,
  } = props;

  const {
    id,
    title,
    completed,
  } = todo;

  const isTodoIdLoading = loadingTodosId.includes(id);

  const handleTodoCheck = () => {
    onUpdate(id, {
      completed: !completed,
    });
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoCheck}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isTodoIdLoading },
        )}
      >

        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
