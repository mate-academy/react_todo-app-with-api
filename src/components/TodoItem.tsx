import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void;
  onUpdate?: (todoTitle: string) => void;
  onTodoToggle: () => Promise<void>
  loadingTodosIds: number[],
  isLoaderActive: boolean,
};

export const TodoItem: React.FC<Props> = React.memo((({
  todo,
  onDelete = () => { },
  onUpdate = () => { },
  onTodoToggle = () => { },
  loadingTodosIds,
  isLoaderActive,
}) => {
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

    if (todosTitle) {
      await onUpdate(todosTitle);
    } else {
      await onDelete(todo.id);
    }

    setIsEditing(false);
  };

  const handleOnKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title.trim());
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          onClick={onTodoToggle}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
              ref={titleInput}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todosTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={(event) => {
                handleOnKeyup(event);
              }}
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
              {todo.title}
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
          'is-active': loadingTodosIds.includes(todo.id) && isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}));
