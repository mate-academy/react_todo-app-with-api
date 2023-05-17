import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  updatingTodoId?: number | null;
  isLoadingNewTodo?: boolean;
  isRemovingCompleted?: boolean;
  isUpdatingEveryStatus?: boolean;
  isEveryTotoCompleted?: boolean;
  onTodoRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
  onTodoTitleUpdate: (todo: Todo, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updatingTodoId,
  isLoadingNewTodo,
  isRemovingCompleted,
  isUpdatingEveryStatus,
  isEveryTotoCompleted,
  onTodoRemove,
  onTodoUpdate,
  onTodoTitleUpdate,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const isUpdating = todo.id === updatingTodoId;
  const isRemovingAllCompleted = todo.completed && isRemovingCompleted;
  const isUpdatingEveryStatusTodo = (!todo.completed && isUpdatingEveryStatus)
    || (isEveryTotoCompleted && isUpdatingEveryStatus);
  const isWorkingLoader = isLoadingNewTodo
    || isRemoving
    || isRemovingAllCompleted
    || isUpdating
    || isUpdatingEveryStatusTodo;

  const handleRemoveTodo = useCallback(() => {
    onTodoRemove(todo.id);
    setIsRemoving(true);
  }, [todo, onTodoRemove]);

  const handleTodoUpdate = useCallback(() => {
    onTodoUpdate(todo);
    setIsEditing(false);
  }, [todo, onTodoUpdate]);

  const handleTodoDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTitleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  }, [todo, onTodoTitleUpdate]);

  const handleTodoBlur = useCallback(() => {
    setIsEditing(false);

    if (editedTitle !== todo.title) {
      onTodoTitleUpdate(todo, editedTitle);
    }
  }, [todo, editedTitle, onTodoTitleUpdate]);

  const handleTodoKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  }, [todo]);

  const handleUpdateTodoTitle = useCallback(() => {
    onTodoTitleUpdate(todo, editedTitle);
    setIsEditing(false);
  }, [todo, editedTitle, onTodoTitleUpdate]);

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoUpdate}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodoTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="What needs to be done?"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTodoBlur}
            onKeyDown={handleTodoKeyDown}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={handleTodoDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
            disabled={isWorkingLoader}
          >
            ×
          </button>

          <div className={classNames('modal', 'overlay', {
            'is-active': isWorkingLoader,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
