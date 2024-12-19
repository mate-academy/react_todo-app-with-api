import { FC, FormEvent, KeyboardEvent, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types';
import { Loader } from './index';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (updatedTodo: Todo) => Promise<void>;
};

export const TodoInfo: FC<Props> = ({
  todo,
  loadingTodoIds,
  onDelete = () => {},
  onUpdate,
}) => {
  const { id, title, completed, userId } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const isLoading = loadingTodoIds.includes(id);

  const handleUpdateTitle = (event: FormEvent) => {
    event.preventDefault();

    if (updatedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!updatedTitle) {
      onDelete(id);

      return;
    }

    const updatedTodo = {
      id,
      title: updatedTitle.trim(),
      completed,
      userId,
    };

    if (onUpdate) {
      onUpdate(updatedTodo)
        .then(() => setIsEditing(false))
        .catch(() => {});
    }
  };

  const handleToggle = () => {
    const updatedTodo = {
      id,
      title,
      completed: !completed,
      userId,
    };

    if (onUpdate) {
      onUpdate(updatedTodo);
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdatedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: completed })}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onClick={handleToggle}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleUpdateTitle}>
            <input
              autoFocus
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={event =>
                setUpdatedTitle(event.target.value.trimStart())
              }
              onKeyUp={handleKeyUp}
              onBlur={handleUpdateTitle}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
        <Loader isLoading={isLoading} />
      </div>
    </>
  );
};
