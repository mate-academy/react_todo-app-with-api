import {
  FC,
  useContext,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { LoadingTodosContext } from '../../LoadingTodosContext';
import type { Todo } from '../../types/Todo';

type Props = {
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  todo: Todo;
};

export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const { loadingTodosIds } = useContext(LoadingTodosContext);

  const isCurrentLoading = useMemo(
    () => loadingTodosIds.includes(id),
    [loadingTodosIds],
  );

  const handleTodoChange = () => {
    onUpdate(id, {
      completed: !completed,
    });
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
          'border-primary completed': completed,
          'opacity-50': isCurrentLoading,
        },
      )}
    >
      <label className="flex items-center justify-center">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={completed}
          onChange={handleTodoChange}
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
            'line-through': completed,
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
