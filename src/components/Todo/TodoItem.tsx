/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: (v: number) => void;
  isLoading: boolean;
  onUpdate?: (v: Todo[]) => Promise<(Todo | void)[]>;
};

export const TodoItem: React.FC<Props> = memo(
  ({ todo, onDelete, isLoading, onUpdate }) => {
    const { id, completed, title } = todo;
    const [isFormActive, setIsFormActive] = useState(false);
    const [updateTitle, setUpdateTitle] = useState(title);
    const editInputRef = useRef<HTMLInputElement | null>(null);

    const updateHandler = useCallback(() => {
      const trimTitle = updateTitle.trim();

      if (title === trimTitle) {
        setIsFormActive(false);

        return;
      }

      if (!trimTitle) {
        onDelete?.(id);

        return;
      }

      onUpdate?.([{ ...todo, title: trimTitle }]).then(resolvedTodos => {
        if (resolvedTodos.some(resTodo => resTodo?.id === id)) {
          setIsFormActive(false);

          return;
        }

        editInputRef.current?.focus();
      });
    }, [todo, id, title, updateTitle, onUpdate, onDelete]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsFormActive(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    return (
      <>
        <div data-cy="Todo" className={cn('todo', { completed: completed })}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => onUpdate?.([{ ...todo, completed: !completed }])}
            />
          </label>

          {!isFormActive ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setIsFormActive(true);
                }}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  onDelete?.(id);
                }}
              >
                ×
              </button>
            </>
          ) : (
            <form
              onSubmit={event => {
                event.preventDefault();
                updateHandler();
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                autoFocus
                ref={editInputRef}
                value={updateTitle}
                onChange={event => setUpdateTitle(event.target.value)}
                onBlur={updateHandler}
              />
            </form>
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </>
    );
  },
);

TodoItem.displayName = 'TodoItem';
