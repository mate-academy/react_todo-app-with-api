import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: () => Promise<void>,
  isLoading: boolean,
  onStatusChange: (updatedTodo: Partial<Todo>) => Promise<void>,
  onTitleChange: (todo: Todo, newTitle: string) => Promise<void>,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onRemove,
  isLoading,
  onStatusChange,
  onTitleChange,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  }, []);

  const handleSuccessfullEdit = () => {
    setIsEditing(true);
    onTitleChange(todo, newTitle);
    setIsEditing(false);
  };

  const handlePressEsc = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleStatusUpdate = async () => {
    await onStatusChange({ completed: !todo.completed });
  };

  const handleRemove = async () => {
    await onRemove();
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', { completed: todo.completed })
      }
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
              handleSuccessfullEdit();
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
              onBlur={handleSuccessfullEdit}
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
              onClick={() => onRemove()}
            >
              ×
            </button>
          </>
        )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemove}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
