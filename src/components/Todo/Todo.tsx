import cn from 'classnames';
import { TodoItem } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorsValues } from '../../utils/errorsValues';
import { useState } from 'react';

type Props = {
  todo: TodoItem;
  setErrorMessage: (message: string) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (todoId: number, data: Partial<TodoItem>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Todo: React.FC<Props> = ({
  todo,
  setErrorMessage,
  onDeleteTodo,
  onUpdateTodo,
  inputRef,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isTemp = todo.id === 0;

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTodo(todo.id)
      .then(() => {
        onDeleteTodo(todo.id);
      })
      .catch(() => {
        setErrorMessage(ErrorsValues.UnableToDeleteTodo);
      })
      .finally(() => {
        setIsDeleting(false);
        inputRef.current?.focus();
      });
  };

  const markTodo = () => {
    setIsUpdating(true);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        onUpdateTodo(updatedTodo.id, { completed: updatedTodo.completed });
      })
      .catch(() => {
        setErrorMessage(ErrorsValues.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const saveEdit = () => {
    if (isUpdating || isDeleting) {
      return;
    }

    const title = newTitle.trim();

    if (title === todo.title) {
      setIsEditing(false);
      inputRef.current?.focus();

      return;
    }

    if (!title) {
      handleDelete();

      return;
    }

    setIsUpdating(true);
    updateTodo(todo.id, { title })
      .then(updatedTodo => {
        onUpdateTodo(updatedTodo.id, { title: updatedTodo.title });
        setIsEditing(false);
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorsValues.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={markTodo}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            saveEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={saveEdit}
            onKeyUp={handleKeyUp}
            autoFocus
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
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
