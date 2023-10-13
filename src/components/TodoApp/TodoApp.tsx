import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../utils/errorMessage';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  loadingId: number[],
  isLoaderActive: boolean,
  onTodoUpdate: (todoTitle: string) => void
  setErrorMessage: (error: string) => void
  onTodoToggle: () => Promise<void>
};

export const TodoApp: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loadingId,
  isLoaderActive,
  onTodoUpdate,
  setErrorMessage,
  onTodoToggle = () => {},
}) => {
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todosTitle, setTodoTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === todosTitle) {
      setIsEditing(false);

      return;
    }

    try {
      if (todosTitle) {
        await onTodoUpdate(todosTitle);
      } else {
        await onDelete(todo.id);
      }

      setIsEditing(false);
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateError);
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleOnKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title.trim());
    }
  };

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={onTodoToggle}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              data-cy="TodoTitleField"
              ref={titleInputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todosTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={(event) => handleOnKeyup(event)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>

        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingId.includes(id) && isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
