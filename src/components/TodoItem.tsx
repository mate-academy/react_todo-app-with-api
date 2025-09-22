/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  loadingTodoId: number[];
  onDelete?: (todoId: number) => void;
  onUpdate?: (todoId: number, update: Partial<Omit<Todo, 'id'>>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  loadingTodoId,
  onDelete,
  onUpdate,
}) => {
  const [editTodoId, setEditTodoId] = useState<number | null>();
  const [editTitle, setEditTitle] = useState(todo.title);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setEditTodoId(null)
      }
    };

    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])


  async function handleTitleEdit(event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>) {
    event.preventDefault();
    const trimmed = editTitle.trim();
    try {
      if (trimmed === todo.title) {
        setEditTodoId(null)
        return
      }
      if (trimmed === '') {
        if (onDelete) {
          await onDelete(todo.id);
           setEditTodoId(null);
          return
        }
      }
      if (onUpdate) {
        await onUpdate(todo.id, { title: trimmed })
        setEditTodoId(null)
        return
      }
    } catch (error) {
      throw error;
    }
}

  const handleCheckedClick = () => {
    if (todo.completed && onUpdate) {
      onUpdate(todo.id, { completed: false })
    } else if (!todo.completed && onUpdate) {
      onUpdate(todo.id, { completed: true })
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          autoFocus
          onClick={handleCheckedClick}
        />
      </label>

      {todo.id === editTodoId ? (
        <form onSubmit={e => handleTitleEdit(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={(e) => handleTitleEdit(e)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditTodoId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              if (onDelete) {
                onDelete(todo.id);
              }
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading && loadingTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
