/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useState, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo;
  deletionIds?: number[];
  pendingTodos?: Todo[];
  errorMessage: Errors;
  onTodosChange?: any;
  onDeleteTodos?: (ids: number[]) => void;
};

export const TodoBody: FC<Props> = ({
  todo,
  deletionIds,
  pendingTodos,
  errorMessage,
  onTodosChange = () => {},
  onDeleteTodos = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleUpdateTodoTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    } else if (!newTitle) {
      onDeleteTodos([todo.id]);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: newTitle.trim(),
    };

    onTodosChange([updatedTodo]).then(() => setIsEditing(false));
  };

  const handleEscapeButton = (key: string) => {
    if (key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }

    return;
  };

  const handleTodoStatus = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    onTodosChange([updatedTodo]);
  };

  const isActive =
    !todo.id ||
    deletionIds?.includes(todo.id) ||
    pendingTodos?.some(current => current.id === todo.id);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing, errorMessage]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodoTitle} onBlur={handleUpdateTodoTitle}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.currentTarget.value)}
            onKeyUp={event => handleEscapeButton(event.key)}
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
            onClick={() => onDeleteTodos([todo.id])}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
