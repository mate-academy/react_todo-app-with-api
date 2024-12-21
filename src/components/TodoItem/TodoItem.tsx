import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDeleteTodo?: (value: number) => Promise<void>;
  onUpdateTodo?: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  isLoading = false,
  onUpdateTodo = () => {},
}) => {
  const { completed, id, title: todoTitle, userId } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todoTitle);
  const inputEdit = useRef(null);

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todoTitle) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDeleteTodo(id)
        ?.then(() => setIsEditing(false))
        .catch(() => {});

      return;
    }

    onUpdateTodo({ id, userId, completed, title: trimmedTitle })
      ?.then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleEditCancel = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            onUpdateTodo({
              id,
              title: editedTitle,
              completed: !completed,
              userId,
            })
          }
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} onKeyUp={handleEditCancel}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={inputEdit}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleEditSubmit}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditedTitle(todoTitle);
            }}
          >
            {todoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
