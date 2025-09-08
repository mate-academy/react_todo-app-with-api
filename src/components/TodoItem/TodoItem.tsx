import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onRename: (todo: Todo, newTitle: string) => void;
  onToggleTodo: (todo: Todo) => void;
  onLoading: boolean;
};
export const TodoItem: React.FC<Props> = React.memo(function TodoItem({
  todo,
  onDelete = () => {},
  onRename = () => {},
  onToggleTodo = () => {},
  onLoading,
}) {
  const [edited, setEdited] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (edited) {
      inputRef.current?.focus();
    }
  }, [edited]);

  // #region handlers

  const handleRemoveClick = async () => {
    try {
      await onDelete(todo.id);
    } catch {}
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (trimmed === todo.title) {
      setEdited(false);

      return;
    }

    try {
      if (trimmed === '') {
        await onDelete(todo.id);
      } else {
        await onRename(todo, trimmed);
      }

      setEdited(false);
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleOnBlur = async () => {
    const trimmed = title.trim();

    try {
      if (trimmed === '') {
        await onDelete(todo.id);
      } else {
        await onRename(todo, trimmed);
      }

      setEdited(false);
    } catch (error) {
      inputRef.current?.focus();
    }
  };

  const handleTodoStatusEdit = async () => {
    await onToggleTodo(todo);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEdited(false);
      setTitle(todo.title);
      inputRef.current?.focus();
    }
  };

  // #endregion

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoStatusEdit}
        />
      </label>

      {edited ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleOnBlur}
            autoFocus
            disabled={onLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEdited(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveClick}
            disabled={onLoading}
          >
            ×
          </button>
        </>
      )}
      <Loader loading={onLoading} />
    </div>
  );
});
