import { FormEvent, useState } from 'react';
import cn from 'classnames';

import type { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo;
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
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const isTempTodo = !('completed' in todo);
  const isCompleted = !isTempTodo && todo.completed;

  const handleTodoUpdate = async () => {
    const processedTitle = newTodoTitle.trim();

    if (todo.title === processedTitle) {
      setIsEditing(false);

      return;
    }

    const wasUpdated = await onTodoUpdate(todo.id, processedTitle);

    if (wasUpdated) {
      setIsEditing(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTodoUpdate();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
            autoFocus
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            onBlur={handleTodoUpdate}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setNewTodoTitle(todo.title);
                setIsEditing(false);
              }
            }}
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
            {todo.title}
          </span>

          {!isTempTodo && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onTodoDelete(todo.id)}
            >
              ×
            </button>
          )}
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
