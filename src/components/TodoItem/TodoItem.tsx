/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { FormEvent, useState } from 'react';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onToggleStatus?: (todo: Todo) => void;
  onRenameTodo?: ((todo: Todo) => Promise<string> | undefined) | undefined;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onToggleStatus = () => {},
  onRenameTodo = () => Promise.resolve(''),
  isLoading,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleEscKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSubmitEditingForm = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedNewTitle) {
      onDelete(todo.id);

      return;
    }

    try {
      const res = await onRenameTodo({ ...todo, title: trimmedNewTitle });

      if (res === 'ok') {
        setIsEditing(false);
      }
    } catch (error) {
      setIsEditing(true);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggleStatus(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmitEditingForm}
          onBlur={handleSubmitEditingForm}
          onKeyUp={handleEscKeyUp}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value.trimStart())}
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
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};