import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isLoading: boolean,
  onDelete: () => Promise<void>,
  onStatusUpdate: (updatedTodo: Partial<Todo>) => Promise<void>,
  onTitleUpdate: (
    todo: Todo,
    newTitle: string
  ) => Promise<void>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onStatusUpdate,
  onTitleUpdate,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  }, []);

  const handleSuccessfulEdit = () => {
    setIsEditing(true);
    onTitleUpdate(todo, newTitle);
    setIsEditing(false);
  };

  const handlePressEsc = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  }

  const handleDelete = async () => {
    await onDelete();
  };

  const handleStatusUpdate = async () => {
    await onStatusUpdate({ completed: !todo.completed });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleStatusUpdate}
        />

      </label>
      {isEditing
        ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleSuccessfulEdit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoTitle}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleSuccessfulEdit}
              onKeyDown={handlePressEsc}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete()}
            >
              ×
            </button>
          </>
        )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
