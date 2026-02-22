/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    const normalizedNewTitle = newTitle.trim();

    if (normalizedNewTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (normalizedNewTitle === '') {
      onDelete(todo.id)
        .then(() => {})
        .catch(() => {
          editField.current?.focus();
        });
    } else {
      onUpdate(todo.id, { title: normalizedNewTitle })
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          editField.current?.focus();
        });
    }
  };

  const handleBlur = () => {
    handleRename();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRename();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={editField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setNewTitle(todo.title);
            }}
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
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
