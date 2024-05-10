/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoad?: boolean;
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, newStatus: boolean) => void;
  isLoading: boolean;
  onChange: (todoId: number, newTodoTitle: string) => void;
  error: 'load' | 'add' | 'delete' | 'update' | 'empty' | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoad = false,
  onDelete,
  toggleTodo,
  isLoading,
  onChange,
  error,
  setIsLoading,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const formFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formFocus.current) {
      formFocus.current.focus();
    }
  }, [isEdit]);

  const handleEditTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.length === 0) {
      onDelete(todo.id);
      setIsLoading(true);
    } else {
      onChange(todo.id, newTodoTitle);
    }

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
