import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoading: boolean;
  toggleTodo: (todoToUpdate: Todo) => void;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  toggleTodo,
  updateTodo,
}) => {
  const [isReNaming, setIsReNaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isReNaming && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isReNaming]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();
    const reset = () => setIsReNaming(false);

    if (trimmedNewTitle === todo.title) {
      reset();

      return;
    }

    if (!trimmedNewTitle) {
      onDelete(todo.id);

      return;
    }

    const updatedTodo = { ...todo, title: trimmedNewTitle };

    updateTodo(updatedTodo).then(reset);
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        'todo completed': todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => toggleTodo(todo)}
        />
      </label>

      {isReNaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsReNaming(false);
            }
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsReNaming(true);
              setNewTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
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

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
