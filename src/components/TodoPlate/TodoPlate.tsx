/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef, FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isDeleting?: number;
  isUpdating?: number;
  loadingBunchIds?: number[];
};

export const TodoPlate: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isDeleting,
  onUpdateTodo,
  isUpdating,
  loadingBunchIds,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setEditing] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const isLoading =
    isDeleting === todo.id ||
    isUpdating === todo.id ||
    todo.id === 0 ||
    loadingBunchIds?.includes(todo.id);

  const updateTodoStatus = async () => {
    const updatedStatus = !todo.completed;
    const updatedTodo = { ...todo, completed: updatedStatus };

    await onUpdateTodo(updatedTodo);
  };

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus();
    }
  }, [isEditing]);

  const updateTodoTitle = async (event: FormEvent) => {
    event.preventDefault();

    const newTitle = title.trim();

    if (newTitle !== todo.title) {
      if (newTitle) {
        const updatedTodo = { ...todo, title: newTitle };

        await onUpdateTodo(updatedTodo);
      } else {
        await onDeleteTodo(todo.id);
      }

      setTitle(newTitle);
      setEditing(false);
    } else {
      setEditing(false);
    }
  };

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditing(false);
      }
    };

    window.addEventListener('keyup', onEscape);

    return () => {
      window.removeEventListener('keyup', onEscape);
    };
  }, []);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={updateTodoStatus}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => updateTodoTitle(event)}
          onBlur={event => updateTodoTitle(event)}
        >
          <input
            ref={editRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
            }}
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
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
