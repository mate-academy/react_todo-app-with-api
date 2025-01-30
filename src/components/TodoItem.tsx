/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  loading?: boolean;
  updateTodo?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loading = false,
  updateTodo,
}) => {
  const [checked, setChecked] = useState(todo.completed);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  useEffect(() => setChecked(todo.completed), [todo.completed]);

  const updateTodoTitle = async () => {
    const formatedEditTitle = editTitle.trim();

    if (formatedEditTitle === todo.title.trim()) {
      setIsEditMode(false);

      return;
    }

    if (formatedEditTitle === '') {
      return deleteTodo(todo.id);
    }

    await updateTodo?.({
      ...todo,
      title: formatedEditTitle,
    });

    setIsEditMode(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateTodoTitle();
  };

  const handleBlur = async () => {
    await updateTodoTitle();
  };

  const handleCheckChange = (event: ChangeEvent) => {
    const value = (event.target as HTMLInputElement).checked;

    setChecked(value);

    void updateTodo?.({
      ...todo,
      completed: value,
    }).catch(() => setChecked(!value));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditMode(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: checked,
      })}
    >
      <label className="todo__status-label" htmlFor="TodoStatus">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={checked}
          // for changing status checkboxs
          style={{ height: '100%', width: '100%' }}
          onChange={handleCheckChange}
        />
      </label>

      {!isEditMode ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditMode(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
