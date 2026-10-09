/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreBlurRef = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const cancelEditing = () => {
    ignoreBlurRef.current = true;
    setTitle(todo.title);
    setIsEditing(false);
  };

  const saveTitle = async () => {
    if (savingRef.current) {
      return;
    }

    if (ignoreBlurRef.current) {
      ignoreBlurRef.current = false;

      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    savingRef.current = true;

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    const success = await onRename(todo.id, trimmedTitle);

    if (success) {
      setTitle(trimmedTitle);
      setIsEditing(false);
    }

    savingRef.current = false;
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void saveTitle();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={() => void saveTitle()}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.preventDefault();
                cancelEditing();
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('loader', {
          'is-active': isLoading,
        })}
      />
    </div>
  );
};
