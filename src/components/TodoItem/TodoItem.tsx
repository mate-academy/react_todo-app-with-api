import { FC, useContext, useState } from 'react';
import classNames from 'classnames';
import type { Todo as TodoType } from '../../types/Todo';
import { LoadingTodoContext } from '../../LoadingTodoContext';

type Props = {
  onDelete: (id: number) => void;
  todo: TodoType;
};

export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
}) => {
  const { id, title, completed } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);
  const { isLoading, todoId } = useContext(LoadingTodoContext);

  const handleStatusChange = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <div
      className={classNames(
        'todo',
        'flex gap-2',
        'h-12 px-2',
        'rounded-lg',
        'items-center',
        'border',
        'shadow-md',
        {
          'border-primary completed': isCompleted,
        },
      )}
    >
      <label className="flex items-center justify-center">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={isCompleted}
          onChange={handleStatusChange}
        />
      </label>

      <span className={classNames(
        'flex-grow',
        'truncate',
        {
          'line-through': isCompleted,
        },
      )}
      >
        {title}
      </span>

      <button
        type="button"
        className="btn btn-square btn-sm btn-ghost"
        onClick={() => onDelete(id)}
      >
        <i className="fa-solid fa-xmark fa-xl" />
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading && todoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
