import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  setError: (message: string) => void;
  loading: number | null;
  deleteTodo: (id: number) => Promise<void> | void;
  updateTodoCheck: (id: number) => void;
  updateTodoTitle: (id: number, value: string) => Promise<void> | void;
  isEditingId: number | null;
  setIsEditingId: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setError,
  loading,
  deleteTodo,
  updateTodoCheck,
  updateTodoTitle,
  isEditingId,
  setIsEditingId,
}) => {
  const [title, setTitle] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleDoubleClick = (id: number, value: string) => {
    setIsEditingId(id);
    setTitle(value);
  };

  const handleSubmit = () => {
    if (title.trim() === '') {
      deleteTodo(todo.id)
        ?.then(() => setIsEditingId(null))
        .catch(() => {
          setIsEditingId(todo.id);
        });
    }

    updateTodoTitle(todo.id, title.trim())
      ?.then(() => setIsEditingId(null))
      .catch(() => {
        setIsEditingId(todo.id);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingId(null);
      setTitle('');
    }
  };

  const titleEditField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingId === todo.id && loading === 0) {
      titleEditField.current?.focus();
    }
  }, [isEditingId, loading, todo.id]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo__status-${todo.id}`}>
        <input
          id={`todo__status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodoCheck(todo.id)}
        />
      </label>

      {isEditingId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            ref={titleEditField}
            data-cy="TodoTitleField"
            value={title}
            placeholder={todo.title === '' ? 'Empty todo will be deleted' : ''}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={handleInput}
            disabled={loading !== 0}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            const { id, title: todoTitle } = todo;

            handleDoubleClick(id, todoTitle);
          }}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      {isEditingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading === todo.id || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
