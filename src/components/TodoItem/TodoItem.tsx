import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate?: (id: number, title: string) => Promise<void>;
  isUpdating?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onUpdate,
  isUpdating,
}) => {
  const isCompleted = todo.completed;
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [todoTitle, setTodoTitle] = React.useState(todo.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleAction = async <T extends unknown[]>(
    action: (...args: T) => Promise<void>,
    ...args: T
  ) => {
    setIsLoading(true);
    try {
      await action(...args);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      await handleAction(onToggle, todo.id, !isCompleted);
    } catch (error) {
      return;
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      if (onDelete) {
        try {
          await handleAction(onDelete, todo.id);
        } catch (error) {
          return;
        }
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (onUpdate) {
      try {
        await handleAction(onUpdate, todo.id, trimmedTitle);
        setIsEditing(false);
      } catch (error) {
        return;
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTodoTitle(todo.title);
  };

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const showLoader =
    (todo.isTemp === true && todo.id === 0) || isLoading || isUpdating;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: isCompleted })}
      >
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': showLoader })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label" htmlFor={String(todo.id)}>
          <input
            id={todo.id.toString()}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={handleToggle}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={ev => setTodoTitle(ev.target.value)}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete && handleAction(onDelete, todo.id)}
            >
              ×
            </button>
          </>
        )}
      </div>
    </>
  );
};
