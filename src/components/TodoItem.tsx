/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (idToDelete: number) => void;
  deletingTodoIds?: number[];
  tempTodo?: Todo | null;
  isProcessed?: boolean;
  onUpdate?: (todo: Todo) => Promise<void>;
  toggleTodoIds?: number[];
  editingTodoId?: number | null;
  setEditingTodoId?: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  deletingTodoIds,
  isProcessed,
  onUpdate = () => {},
  toggleTodoIds,
  editingTodoId,
  setEditingTodoId = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [hasErrorEditing, setHasErrorEditing] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      onDelete(todo.id);

      return;
    }

    if (todo.title.trim() === todoTitle.trim()) {
      setEditingTodoId(null);

      return;
    }

    Promise.resolve(onUpdate?.({ ...todo, title: todoTitle.trim() }))
      .then(() => {
        setEditingTodoId(null);
      })
      .catch(() => {
        setHasErrorEditing(true);
        inputRef.current?.focus();
      });
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  useEffect(() => {
    if (editingTodoId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodoId]);

  useEffect(() => {
    if (hasErrorEditing && inputRef.current) {
      inputRef.current.focus();
      setHasErrorEditing(false);
    }
  }, [hasErrorEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo?.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {
            const updatedTodo = { ...todo, completed: !todo.completed };

            onUpdate(updatedTodo);
          }}
        />
      </label>

      {editingTodoId === todo?.id ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={ev => setTodoTitle(ev.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              if (todo) {
                setEditingTodoId(todo.id);
                setTodoTitle(todo.title);
              }
            }}
          >
            {todo?.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => todo && onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            deletingTodoIds?.includes(todo.id) ||
            toggleTodoIds?.includes(todo.id) ||
            isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
