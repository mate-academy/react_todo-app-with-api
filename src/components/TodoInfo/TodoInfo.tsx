import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todo: Todo) => void;
  onEditStatus: (todoToEdit: Todo, status: boolean) => void;
  onEditTitle: (TodoToEdit: Todo, title: string) => void;
  processedTodos: Todo[];
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  onEditStatus,
  onEditTitle,
  processedTodos,
}) => {
  const { title, completed, id } = todo;
  const [isRenaiming, setIsRenaiming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const isLoading = processedTodos.includes(todo);
  const loaderCondition = id === 0 || isLoading;

  const handleDoubleClick = () => {
    setIsRenaiming(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTitle(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (newTitle === title) {
      setIsRenaiming(false);

      return;
    }

    const trimmedTitle = newTitle.trim();

    event.preventDefault();
    onEditTitle(todo, trimmedTitle);
    setIsRenaiming(false);
  };

  const handleOnBlurSubmit = () => {
    if (newTitle === title) {
      setIsRenaiming(false);

      return;
    }

    onEditTitle(todo, newTitle);
    setIsRenaiming(false);
  };

  const handleEscapePress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsRenaiming(false);
      setNewTitle(title);
    }
  };

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onEditStatus(todo, !completed)}
          defaultChecked
        />
      </label>

      {isRenaiming
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={handleOnBlurSubmit}
              onChange={handleTitleChange}
              onKeyDown={handleEscapePress}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo)}
            >
              ×
            </button>
          </>
        )}

      <div className={cn(
        'modal overlay',
        { 'is-active': loaderCondition },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
