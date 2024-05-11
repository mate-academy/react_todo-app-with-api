/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoad?: boolean;
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, newStatus: boolean) => void;
  onChange: (todoId: number, newTodoTitle: string) => void;
  error: 'load' | 'add' | 'delete' | 'update' | 'empty' | null;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoad = false,
  onDelete,
  toggleTodo,
  onChange,
  error,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const formFocus = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formFocus.current) {
      formFocus.current.focus();
    }
  }, [isEdit]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [todo.completed, error, todo.title]);

  const handleEditTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.length === 0) {
      onDelete(todo.id);
    } else {
      onChange(todo.id, newTodoTitle);
    }

    setIsLoading(true);
    setIsEdit(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (e.key === 'Escape') {
      setNewTodoTitle(todo.title);
      onChange(todoId, todo.title);
    }
  };

  const handleBlur = (value: string) => {
    if (value !== todo.title) {
      onChange(todo.id, value);
      setIsEdit(false);
    }

    if (!value) {
      onDelete(todo.id);
    }

    setNewTodoTitle(todo.title);
    setIsEdit(false);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            toggleTodo(todo.id, !todo.completed);
            setIsLoading(true);
          }}
        />
      </label>

      {isEdit || error ? (
        <form onSubmit={handleEditTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            ref={formFocus}
            onKeyDown={event => handleKeyDown(event, todo.id)}
            onBlur={() => handleBlur(newTodoTitle)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(todo.id);
              setIsDeleting(true);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoad || isDeleting || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
