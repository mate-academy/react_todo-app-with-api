/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isSubmitting?: boolean;
  onSetErrorMessage: (message: ErrorMessage | null) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoItem = ({
  todo,
  onDelete,
  isSubmitting,
  onSetErrorMessage,
  onUpdate,
}: Props) => {
  const { id, title, completed } = todo;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setIsDeleting(true);
      try {
        await deleteTodo(id);
        onDelete(id);
        setIsEditing(false);
      } catch {
        onSetErrorMessage(ErrorMessage.delete);
      } finally {
        setIsDeleting(false);
      }
    } else if (trimmedTitle !== title) {
      setIsUpdating(true);
      try {
        const updatedTodo = { ...todo, title: trimmedTitle };

        await updateTodo(id, { title: trimmedTitle });
        onUpdate(updatedTodo);
        setIsEditing(false);
      } catch {
        onSetErrorMessage(ErrorMessage.update);
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  async function handleDelete(todoId: number) {
    setIsDeleting(true);

    try {
      await deleteTodo(todoId);
      onDelete(todoId);
    } catch {
      onSetErrorMessage(ErrorMessage.delete);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCompletedStatus(status: boolean) {
    setIsUpdating(true);

    try {
      const updatedTodo = { ...todo, completed: !status };

      await updateTodo(todo.id, { completed: !status });
      onUpdate(updatedTodo);
    } catch {
      onSetErrorMessage(ErrorMessage.update);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedStatus(completed)}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isSubmitting || isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
