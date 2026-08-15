import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
  onUpdate: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
}) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(todo.title);
  const [pressedKey, setPressedKey] = useState<string>('');

  const handleKeyUp = (event: KeyboardEvent) => {
    setPressedKey(event.key);
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [updating]);

  useEffect(() => {
    if (pressedKey === 'Escape') {
      setInputValue(todo.title);
      setUpdating(false);
      setPressedKey('');
    }
  }, [pressedKey, todo.title]);

  const handleUpdate = () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) {
      onDelete(todo.id);

      return;
    }

    if (trimmedInput === todo.title) {
      setUpdating(false);

      return;
    }

    onUpdate({
      id: todo.id,
      userId: todo.userId,
      completed: todo.completed,
      title: trimmedInput,
    }).then(() => setUpdating(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={todo.title}
          onChange={() => {
            onUpdate({
              id: todo.id,
              userId: todo.userId,
              completed: !todo.completed,
              title: todo.title,
            });
          }}
        />
      </label>

      {updating ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleUpdate();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={event => setInputValue(event.currentTarget.value)}
            autoFocus
            onBlur={handleUpdate}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setInputValue(todo.title);
              setUpdating(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
