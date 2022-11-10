import classNames from 'classnames';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  isLoading: boolean
  onRemove?: (todoId: number) => Promise<void>
  toggleTodoStatus: (todoId: number, status: boolean) => Promise<void>
  removeTodo: (todoId: number) => Promise<void>
  changeTitle: (todoId: number, newTitle: string) => Promise<void>
};

export const TodoListItem: React.FC<Props> = React.memo(({
  todo,
  onRemove,
  isLoading,
  toggleTodoStatus,
  removeTodo,
  changeTitle,
}) => {
  const { title, id, completed } = todo;

  const textInput = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleStatusToggle = useCallback(() => {
    toggleTodoStatus(id, !completed);
  }, [completed]);

  const handleRemoveClick = useCallback(() => {
    if (onRemove) {
      onRemove(id);
    }
  }, [id]);

  const handleRemove = useCallback(() => {
    removeTodo(id);
  }, []);

  const changeTodoTitle = useCallback(() => {
    const trimedTitle = newTitle.trim();

    setIsEditing(false);

    if (!trimedTitle) {
      handleRemove();

      return;
    }

    if (title === trimedTitle) {
      return;
    }

    setNewTitle(trimedTitle);
    changeTitle(id, trimedTitle);
  }, [newTitle, title]);

  const handleFormSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    changeTodoTitle();
  }, [changeTodoTitle]);

  const handleInputKeydown = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  }, [title]);

  const handleInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  }, []);

  const handleOnBlur = useCallback(changeTodoTitle, [changeTodoTitle]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={handleStatusToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="If todo empty, it will be deleted"
            ref={textInput}
            value={newTitle}
            onChange={handleInput}
            onBlur={handleOnBlur}
            onKeyDown={handleInputKeydown}
          />
        </form>
      ) : (
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
            data-cy="TodoDeleteButton"
            onClick={handleRemoveClick}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
