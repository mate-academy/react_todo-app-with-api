import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodoStatus, updateTodoTitle } from '../api/todos';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todo: Todo) => void;
  onError: (message: string) => void;
  onUpdate: (updatedTodo: Todo) => void;
};

export const TodoItem = ({
  todo,
  isLoading,
  onDelete,
  onError,
  onUpdate,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [checked, setChecked] = useState(todo.completed);
  const editInputRef = useRef<HTMLInputElement>(null);

  const isCompleted = todo.completed;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleStatusChange = async () => {
    if (isEditingLoading) {
      return;
    }

    setIsEditingLoading(true);

    try {
      const updatedTodo = await updateTodoStatus(todo.id, !isCompleted);

      setChecked(prevChecked => !prevChecked);
      onUpdate(updatedTodo);
    } catch {
      onError('Unable to update a todo');
    } finally {
      setIsEditingLoading(false);
    }
  };

  const handleEditDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const isHandlingRef = useRef(false);

  const handleEditTodo = async () => {
    if (isEditingLoading || isHandlingRef.current) {
      return;
    }

    isHandlingRef.current = true;

    if (editTitle === todo.title) {
      setIsEditing(false);
      isHandlingRef.current = false;

      return;
    }

    const trimmedNewTitle = editTitle.trim();

    setIsEditingLoading(true);

    if (trimmedNewTitle === '') {
      try {
        await deleteTodo(todo.id);
        onDelete?.(todo);
      } catch {
        onError('Unable to delete a todo');
      } finally {
        setIsEditingLoading(false);
        isHandlingRef.current = false;
      }
    } else {
      try {
        const updatedTodo = await updateTodoTitle(todo.id, trimmedNewTitle);

        onUpdate(updatedTodo);
        setIsEditing(false);
      } catch {
        onError('Unable to update a todo');
      } finally {
        setIsEditingLoading(false);
        isHandlingRef.current = false;
      }
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditingLoading) {
      return;
    }

    await handleEditTodo();
  };

  const handleEditKeyUp = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    } else if (event.key === 'Enter') {
      await handleEditTodo();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isCompleted })}
      onDoubleClick={handleEditDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={String(todo.id)}>
        <input
          id={String(todo.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={checked}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={isEditingLoading ? undefined : handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleEditChange}
            onBlur={handleEditTodo}
            onKeyUp={handleEditKeyUp}
            ref={editInputRef}
            disabled={isEditingLoading}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isEditingLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
