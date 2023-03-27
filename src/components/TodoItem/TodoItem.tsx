import {
  FC,
  useContext,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import type { Todo as TodoType } from '../../types/Todo';
import { LoadingTodosContext } from '../../LoadingTodosContext';

type Props = {
  onDelete: (id: number) => void;
  todo: TodoType;
};

export const TodoItem: FC<Props> = ({ todo, onDelete }) => {
  const { id, title, completed } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);
  const { isLoading, loadingTodosIds } = useContext(LoadingTodosContext);

  const isCurrentLoading = useMemo(
    () => isLoading && loadingTodosIds.includes(id),
    [isLoading, loadingTodosIds],
  );

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
        'relative',
        {
          'border-primary completed': isCompleted,
          'opacity-50': isCurrentLoading,
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

      <div className="grow relative">
        {isCurrentLoading && (
          <div
            className="w-full absolute top-1/2 left-1/2
              transform -translate-x-1/2 -translate-y-1/2
              flex justify-center items-center"
          >
            <div
              className="
                w-5 h-5 rounded-full animate-spin border-2
                border-primary border-dashed"
              style={
                {
                  '--value': '70',
                  '--size': '1rem',
                  '--thickness': '.25rem',
                } as React.CSSProperties
              }
            />
          </div>
        )}

        <span
          className={classNames('grow', 'truncate', {
            'line-through': isCompleted,
          })}
        >
          {title}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-square btn-xs btn-ghost"
        onClick={() => onDelete(id)}
      >
        <i className="fa-solid fa-xmark fa-xl" />
      </button>
    </div>
  );
};
