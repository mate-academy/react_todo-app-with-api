import { FormEvent, useEffect, useState } from 'react';
import cn from 'classnames';

import type { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo | null;
  isPending: boolean;
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, completed: boolean) => void;
  onTodoUpdate: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoItem = ({
  todo,
  isPending,
  onTodoDelete,
  onTodoToggle,
  onTodoUpdate,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo?.title || '');

  useEffect(() => {
    const closeEditing = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    window.addEventListener('keyup', closeEditing);

    return () => window.removeEventListener('keyup', closeEditing);
  }, []);

  if (!todo) {
    return null;
  }

  const isCompleted = 'completed' in todo ? todo.completed : false;

  const handleTodoUpdate = async () => {
    if (todo.title !== newTodoTitle) {
      const wasUpdated = await onTodoUpdate(todo.id, newTodoTitle);

      if (wasUpdated) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTodoUpdate();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          name="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={event => onTodoToggle(todo.id, event.target.checked)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus={isEditing}
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            onBlur={handleTodoUpdate}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todo?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
