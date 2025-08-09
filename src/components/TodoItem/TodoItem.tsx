/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  isLoading?: boolean;
  handleEditTodo?: (todo: Todo) => Promise<boolean>;
  onToggleStatus?: (todo: Todo) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isLoading = false,
  handleEditTodo = () => {},
  onToggleStatus = () => {},
  inputRef,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing, inputRef]);

  const submitEditedTitle = async () => {
    const success = await handleEditTodo({ ...todo, title: editedTitle });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      await submitEditedTitle();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            disabled={isLoading}
            onChange={() => onToggleStatus(todo)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={submitEditedTitle}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onBlur={submitEditedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
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

            {/* Remove button appears only on hover */}
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

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
