import React, {
  memo, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void
  onUpdate: (todoId: number) => void
  isUpdating: boolean;
}
export const TodoItem: React.FC<Props> = memo(({
  todo,
  onDelete,
  onUpdate,
  isUpdating,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { id, title, completed } = todo;
  const ref = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(ref);

  useEffect(() => {
    setInput(input);
  }, [ref]);
  // eslint-disable-next-line no-console
  console.log(input);

  return (
    <div
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
          onChange={() => onUpdate(id)}
        />
      </label>

      {!isActive ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsActive(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // value="Todo is being edited now"
            ref={ref}
          />
        </form>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isUpdating },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
