/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ChangeEvent, FormEvent, useState } from 'react';
import { TodoViewModel } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: TodoViewModel;
  onDelete: (id: number) => void;
  onUpdateTodo: (
    id: number,
    completed: boolean,
    title: string,
  ) => Promise<void>;
};

export function TodoItem({ todo, onDelete, onUpdateTodo }: Props) {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);

  async function handleDelete(id: number) {
    setDisabled(true);
    try {
      await onDelete(id);
      setIsEditing(false);

      return true;
    } catch {
      return false;
    } finally {
      setDisabled(false);
    }
  }

  async function updateTodo(value: string, completed: boolean) {
    setDisabled(true);

    try {
      await onUpdateTodo(todo.id, completed, value.trim());
      setIsEditing(false);
    } catch {
    } finally {
      setDisabled(false);
    }
  }

  async function submitTodo() {
    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      await handleDelete(todo.id);

      return;
    }

    await updateTodo(trimmedTitle, todo.completed);
  }

  async function handleBlur() {
    await submitTodo();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await submitTodo();
  }

  function handleUpdateTodo(e: ChangeEvent<HTMLInputElement>) {
    const completed = e.target.checked;

    updateTodo(title, completed);
  }

  function handleEscape(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => handleUpdateTodo(event)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={event => handleEscape(event)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title.trim()}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo?.isLoading || disabled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
