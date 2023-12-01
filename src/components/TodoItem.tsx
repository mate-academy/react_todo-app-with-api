import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Todo) => void,
  updatingTodo: Todo | undefined,
  deletingTodo: Todo | undefined,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  updatingTodo,
  deletingTodo,
}) => {
  const { id, title, completed } = todo;
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputField = useRef<HTMLInputElement | null>(null);

  const isLoading = todo.id === 0
    || updatingTodo?.id === todo.id
    || deletingTodo?.id === todo.id;

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEdit]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editTitle.trim() === title) {
      setIsEdit(false);

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    editTitle.trim()
      ? updateTodo({ ...todo, title: editTitle.trim() })
      : deleteTodo(id);

    setIsEdit(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo({ ...todo, completed: !completed })}
          checked={completed}
        />
      </label>

      {isEdit
        ? (
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              ref={inputField}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyUp={handleKeyUp}
              onBlur={handleEditSubmit}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEdit(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
