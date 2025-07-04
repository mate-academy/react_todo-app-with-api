/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from 'types/Todo';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isLoading: boolean;
  handleDelete?: () => Promise<void>; // 🔧 змінено тип функції
  isDeleting: boolean;
  onToggle?: () => Promise<void>;
  onRename?: (title: string) => Promise<void>;
}

export const TodoItem: FC<Props> = ({
  todo,
  isLoading,
  handleDelete,
  isDeleting,
  onToggle,
  onRename,
}: Props) => {
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const [isLoadingChanges, setIsLoadingChanges] = useState(false);
  const [enterTriggeredSave, setEnterTriggeredSave] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFormActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormActive]);

  const handleToggleTodo = async () => {
    setIsToggleLoading(true);
    if (onToggle) {
      await onToggle();
    }

    setIsToggleLoading(false);
  };

  const focusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveChanges = async () => {
    setIsLoadingChanges(true);

    const trimmedTitle = title.trim();
    const originalTitle = todo.title.trim();

    try {
      if (!trimmedTitle) {
        try {
          if (handleDelete) {
            await handleDelete();
          }

          setIsFormActive(false);

          return;
        } catch {
          focusInput();

          return;
        }
      }

      if (trimmedTitle !== originalTitle) {
        await onRename?.(trimmedTitle);
      }

      setIsFormActive(false);
    } catch {
      focusInput();
    } finally {
      setIsLoadingChanges(false);
      setEnterTriggeredSave(false);
    }
  };

  const handleOnBlur = () => {
    if (isLoadingChanges || enterTriggeredSave) {
      return;
    }

    saveChanges();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnterTriggeredSave(true);
    saveChanges();
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsFormActive(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled={isLoading}
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isFormActive ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            onBlur={handleOnBlur}
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setIsFormActive(false);
                setTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete} // 🔧 передаємо вже обгорнуту функцію
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading || isToggleLoading || isDeleting || isLoadingChanges,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
