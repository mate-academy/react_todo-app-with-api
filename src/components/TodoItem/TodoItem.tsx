/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodosContext } from '../../context/TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;
  const {
    onHandleUpdateTodo,
    onHandleDeleteTodo,
    loadingTodos,
    editTodoByID,
    setEditTodoByID,
  } = useTodosContext();

  const [editTitle, setEditTitle] = useState(title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodoByID === id) {
      editInputRef.current?.focus();
    }
  }, [editTodoByID, id]);

  const handleDoubleClick = () => {
    setEditTodoByID(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleEditTitle = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle.trim() === '') {
      onHandleDeleteTodo(id);

      return;
    }

    if (trimmedTitle !== title) {
      onHandleUpdateTodo(id, trimmedTitle, completed);
      setEditTodoByID(null);
    }

    setEditTodoByID(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEditTitle();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditTodoByID(null);
      setEditTitle(title);
    }
  };

  const toggleTodoCompleted = () => {
    onHandleUpdateTodo(id, title, !completed);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={toggleTodoCompleted}
          />
        </label>

        {editTodoByID !== id ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onHandleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onBlur={handleEditTitle}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              ref={editInputRef}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loadingTodos.has(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
